class ProjectUploadImageState {
  bool isLoading;
  String error;

  ProjectUploadImageState.loading() {
    isLoading = true;
  }

  ProjectUploadImageState.error(this.error) {
    this.isLoading = false;
  }

  ProjectUploadImageState.success() {
    this.isLoading = false;
  }
}