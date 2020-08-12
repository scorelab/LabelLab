import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/repository.dart';

class RetryOnAuthFailInterceptor extends Interceptor {
  Dio _dio;
  RetryOnAuthFailInterceptor(this._dio);

  @override
  Future onError(DioError err) async {
    if (err.response != null && err.response.statusCode == 401) {
      _dio.interceptors.requestLock.lock();
      _dio.interceptors.responseLock.lock();

      Repository().refreshToken();

      _dio.interceptors.requestLock.unlock();
      _dio.interceptors.responseLock.unlock();

      return Dio().request(
        err.request.path,
        cancelToken: err.request.cancelToken,
        data: err.request.data,
        onReceiveProgress: err.request.onReceiveProgress,
        onSendProgress: err.request.onSendProgress,
        queryParameters: err.request.queryParameters,
        options: err.request,
      );
    }

    return err;
  }
}
