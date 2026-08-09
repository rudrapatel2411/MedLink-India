class UserModel {
  final String id;
  final String email;
  final String name;
  final String role;
  final String? abhaId;
  final String? phone;

  UserModel({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    this.abhaId,
    this.phone,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? '',
      role: json['role'] ?? 'PATIENT',
      abhaId: json['abhaId'],
      phone: json['phone'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'role': role,
      'abhaId': abhaId,
      'phone': phone,
    };
  }
}
