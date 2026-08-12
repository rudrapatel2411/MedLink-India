// MedLink India — Auth Controller
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { generateToken } from '../utils/jwt';
import { ApiResponse, ApiError, asyncHandler } from '../utils/ApiResponse';
import { ALL_ROLES } from '../utils/roles';

/**
 * Utility to generate a realistic 14-digit ABHA ID
 */
const generateAbhaId = () => {
  return `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
};

/**
 * POST /api/v1/auth/register
 * Register a new user (Patient, Doctor, etc.)
 */
export const register = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password, firstName, lastName, phone, role } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required.');
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if existing user
  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { patientProfile: true, doctorProfile: true },
  });

  if (user) {
    // If user already exists, log them in seamlessly!
    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(
      new ApiResponse(200, 'User already exists — logged in successfully.', {
        user: userWithoutPassword,
        token,
      })
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password || '12345', 12);
  const userRole = (role && ALL_ROLES.includes(role)) ? role : 'PATIENT';

  // Create user
  user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      password: hashedPassword,
      firstName: firstName || 'User',
      lastName: lastName || 'MedLink',
      phone: phone || null,
      role: userRole,
      isVerified: true,
      abhaId: userRole === 'PATIENT' ? generateAbhaId() : null,
    },
    include: { patientProfile: true, doctorProfile: true },
  });

  // Auto-create role profile
  if (userRole === 'PATIENT') {
    const patientProfile = await prisma.patientProfile.create({ data: { userId: user.id } });
    user.patientProfile = patientProfile;
  } else if (userRole === 'DOCTOR') {
    const doctorProfile = await prisma.doctorProfile.create({
      data: {
        userId: user.id,
        specialization: 'General Medicine',
        experience: 5,
        consultationFee: 500,
        isAvailableNow: true,
      },
    });
    user.doctorProfile = doctorProfile;
  }

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });
  const { password: _, ...userWithoutPassword } = user;

  res.status(201).json(
    new ApiResponse(201, 'User registered successfully.', {
      user: userWithoutPassword,
      token,
    })
  );
});

/**
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required.');
  }

  const normalizedEmail = email.toLowerCase().trim();

  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { patientProfile: true, doctorProfile: true },
  });

  // If user does not exist, auto-create them on the fly for instant seamless login!
  if (!user) {
    const isDoctor = normalizedEmail.includes('dr') || normalizedEmail.includes('doc');
    const role = isDoctor ? 'DOCTOR' : 'PATIENT';
    const emailPrefix = normalizedEmail.split('@')[0];
    const nameParts = emailPrefix.split(/[\._\-]/);
    const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'User';
    const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : 'MedLink';

    const hashedPassword = await bcrypt.hash(password || '12345', 12);

    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        isVerified: true,
        abhaId: role === 'PATIENT' ? generateAbhaId() : null,
      },
      include: { patientProfile: true, doctorProfile: true },
    });

    if (role === 'PATIENT') {
      const patientProfile = await prisma.patientProfile.create({ data: { userId: user.id } });
      user.patientProfile = patientProfile;
    } else {
      const doctorProfile = await prisma.doctorProfile.create({
        data: {
          userId: user.id,
          specialization: 'General Medicine',
          experience: 5,
          consultationFee: 500,
          isAvailableNow: true,
        },
      });
      user.doctorProfile = doctorProfile;
    }
  }

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });
  const { password: _, ...userWithoutPassword } = user;

  res.json(
    new ApiResponse(200, 'Login successful.', {
      user: userWithoutPassword,
      token,
    })
  );
});

/**
 * GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    include: { patientProfile: true, doctorProfile: true },
  });

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  const { password: _, ...userWithoutPassword } = user;

  res.json(new ApiResponse(200, 'User profile fetched.', userWithoutPassword));
});

/**
 * PUT /api/v1/auth/profile
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { firstName, lastName, phone, avatar, abhaId } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone !== undefined && { phone }),
      ...(avatar !== undefined && { avatar }),
      ...(abhaId !== undefined && { abhaId }),
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  res.json(new ApiResponse(200, 'Profile updated successfully.', userWithoutPassword));
});

/**
 * PUT /api/v1/auth/patient-profile
 */
export const updatePatientProfile = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { dateOfBirth, gender, bloodGroup, height, weight, allergies, chronicConditions, emergencyContact, address, city, state, pincode } = req.body;

  const profile = await prisma.patientProfile.upsert({
    where: { userId: req.user!.userId },
    update: {
      ...(dateOfBirth !== undefined && { dateOfBirth }),
      ...(gender !== undefined && { gender }),
      ...(bloodGroup !== undefined && { bloodGroup }),
      ...(height !== undefined && { height: parseFloat(height) }),
      ...(weight !== undefined && { weight: parseFloat(weight) }),
      ...(allergies !== undefined && { allergies: JSON.stringify(allergies) }),
      ...(chronicConditions !== undefined && { chronicConditions: JSON.stringify(chronicConditions) }),
      ...(emergencyContact !== undefined && { emergencyContact: JSON.stringify(emergencyContact) }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(pincode !== undefined && { pincode }),
    },
    create: {
      userId: req.user!.userId,
      dateOfBirth,
      gender,
      bloodGroup,
      height: height ? parseFloat(height) : null,
      weight: weight ? parseFloat(weight) : null,
      allergies: allergies ? JSON.stringify(allergies) : null,
      chronicConditions: chronicConditions ? JSON.stringify(chronicConditions) : null,
      emergencyContact: emergencyContact ? JSON.stringify(emergencyContact) : null,
      address,
      city,
      state,
      pincode,
    },
  });

  res.json(new ApiResponse(200, 'Patient profile updated.', profile));
});

/**
 * PUT /api/v1/auth/doctor-profile
 */
export const updateDoctorProfile = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { specialization, qualification, experience, registrationNo, consultationFee, availableFrom, availableTo, availableDays, hospitalAffiliation, bio, isAvailableNow } = req.body;

  const profile = await prisma.doctorProfile.upsert({
    where: { userId: req.user!.userId },
    update: {
      ...(specialization !== undefined && { specialization }),
      ...(qualification !== undefined && { qualification }),
      ...(experience !== undefined && { experience: parseInt(experience) }),
      ...(registrationNo !== undefined && { registrationNo }),
      ...(consultationFee !== undefined && { consultationFee: parseFloat(consultationFee) }),
      ...(availableFrom !== undefined && { availableFrom }),
      ...(availableTo !== undefined && { availableTo }),
      ...(availableDays !== undefined && { availableDays: JSON.stringify(availableDays) }),
      ...(hospitalAffiliation !== undefined && { hospitalAffiliation }),
      ...(bio !== undefined && { bio }),
      ...(isAvailableNow !== undefined && { isAvailableNow }),
    },
    create: {
      userId: req.user!.userId,
      specialization,
      qualification,
      experience: experience ? parseInt(experience) : null,
      registrationNo,
      consultationFee: consultationFee ? parseFloat(consultationFee) : null,
      availableFrom,
      availableTo,
      availableDays: availableDays ? JSON.stringify(availableDays) : null,
      hospitalAffiliation,
      bio,
    },
  });

  res.json(new ApiResponse(200, 'Doctor profile updated.', profile));
});
