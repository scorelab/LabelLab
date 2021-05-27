import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/repository.dart';

class RetryOnAuthFailInterceptor extends Interceptor {
  Dio _dio;
  RetryOnAuthFailInterceptor(this._dio);

  @override
  Future onError(DioError err, ErrorInterceptorHandler handler) async {
    if (err.response != null && err.response.statusCode == 401) {
      _dio.interceptors.requestLock.lock();
      _dio.interceptors.responseLock.lock();

      Repository().refreshToken();

      _dio.interceptors.requestLock.unlock();
      _dio.interceptors.responseLock.unlock();

      final RequestOptions options = err.response.requestOptions;

      return Dio().fetch(options);
    }

    return err;
  }
}
