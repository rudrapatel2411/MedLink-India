import 'package:flutter/foundation.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../constants/api_constants.dart';
import 'api_service.dart';

class SocketService extends ChangeNotifier {
  IO.Socket? _socket;
  bool _isConnected = false;
  final List<Map<String, dynamic>> _notifications = [];

  bool get isConnected => _isConnected;
  List<Map<String, dynamic>> get notifications => _notifications;

  void initSocket() async {
    final token = await ApiService.getToken();
    if (token == null) return;

    _socket = IO.io(
      ApiConstants.socketUrl,
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': token})
          .disableAutoConnect()
          .build(),
    );

    _socket?.connect();

    _socket?.onConnect((_) {
      _isConnected = true;
      notifyListeners();
    });

    _socket?.onDisconnect((_) {
      _isConnected = false;
      notifyListeners();
    });

    _socket?.on('notification', (data) {
      if (data is Map<String, dynamic>) {
        _notifications.insert(0, data);
        notifyListeners();
      }
    });

    _socket?.on('broadcast', (data) {
      if (data is Map<String, dynamic>) {
        _notifications.insert(0, data);
        notifyListeners();
      }
    });
  }

  void disconnect() {
    _socket?.disconnect();
    _socket = null;
    _isConnected = false;
    notifyListeners();
  }
}
