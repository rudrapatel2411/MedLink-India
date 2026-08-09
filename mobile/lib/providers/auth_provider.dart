import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import '../core/services/api_service.dart';
import '../core/constants/api_constants.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  bool _isLoading = false;
  String? _error;

  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;
  String? get error => _error;

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final res = await ApiService.post(ApiConstants.login, {
        'email': email,
        'password': password,
      });

      if (res['token'] != null) {
        await ApiService.saveToken(res['token']);
        _user = UserModel.fromJson(res['user']);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Invalid server response';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(String email, String password, String name, String role) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final res = await ApiService.post(ApiConstants.register, {
        'email': email,
        'password': password,
        'name': name,
        'role': role,
      });

      if (res['token'] != null) {
        await ApiService.saveToken(res['token']);
        _user = UserModel.fromJson(res['user']);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Registration failed';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await ApiService.removeToken();
    _user = null;
    notifyListeners();
  }
}
