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

    _socket = IO.io(
      ApiConstants.socketUrl,
      IO.OptionBuilder()
          .setTransports(['websocket', 'polling'])
          .setAuth(token != null ? {'token': token} : {})
          .enableAutoConnect()
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

    // Handle generic notifications
    _socket?.on('notification', (data) => _addNotification(data));
    _socket?.on('broadcast', (data) => _addNotification(data));
    _socket?.on('emergency_sos', (data) => _addNotification(data));
    _socket?.on('opd_queue_update', (data) => _addNotification(data));
    _socket?.on('bed_update', (data) => _addNotification(data));
    _socket?.on('prescription_issued', (data) => _addNotification(data));
    _socket?.on('claim_updated', (data) => _addNotification(data));
    _socket?.on('lab_report_pushed', (data) => _addNotification(data));
  }

  void _addNotification(dynamic data) {
    if (data is Map) {
      _notifications.insert(0, Map<String, dynamic>.from(data));
      notifyListeners();
    }
  }

  void emitEvent(String event, Map<String, dynamic> data) {
    if (_socket != null && _isConnected) {
      _socket?.emit(event, data);
    }
  }

  void disconnect() {
    _socket?.disconnect();
    _socket = null;
    _isConnected = false;
    notifyListeners();
  }
}
