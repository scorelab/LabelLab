import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/remote/labellab_api_impl.dart';
import 'package:labellab_mobile/screen/backend_selection/backend_service_selector.dart';

class BackendUrlInterceptor extends Interceptor {
  final Dio? dio;
  static const String STATIC_CLASSIFICATION_URL =
      "static/uploads/classifications/";
  static const String STATIC_IMAGE_URL = "static/img/";
  static const String STATIC_UPLOADS_URL = "static/uploads/";

  BackendUrlInterceptor(this.dio);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    BackendServiceSelector().getBackendURLFromLocalStorage().then((baseUrl) {
      if (baseUrl != null) {
        // Add base url to request url
        options.baseUrl = baseUrl;
        // Add base url to static urls
        LabelLabAPIImpl.STATIC_CLASSIFICATION_URL =
            baseUrl + STATIC_CLASSIFICATION_URL;
        LabelLabAPIImpl.STATIC_IMAGE_URL = baseUrl + STATIC_IMAGE_URL;
        LabelLabAPIImpl.STATIC_UPLOADS_URL = baseUrl + STATIC_UPLOADS_URL;
        handler.next(options);
      }
    });
    super.onRequest(options, handler);
  }
}
