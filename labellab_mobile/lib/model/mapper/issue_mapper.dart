import 'package:labellab_mobile/model/issue.dart';

class IssueMapper {
  IssueMapper._();

   static IssueStatus mapJsonToStatus(String? status) {
    switch (status) {
      case "Open":
        return IssueStatus.OPEN;
      case "In Progress":
        return IssueStatus.IN_PROGRESS;
         case "Closed":
        return IssueStatus.CLOSED;
        case "Done":
        return IssueStatus.DONE;
        case "Review":
        return IssueStatus.REVIEW;
      default:
        return IssueStatus.OPEN;
    }
  }

  static String statusToString(IssueStatus? status) {
    switch (status) {
      case IssueStatus.OPEN:
        return "Open";
      case IssueStatus.IN_PROGRESS:
        return "In Progress";
         case IssueStatus.CLOSED:
        return "Closed";
        case IssueStatus.DONE:
        return "Done";
        case IssueStatus.REVIEW:
        return "Review";
      default:
        return "Open";
    }
  }

  static IssuePriority mapJsonToPriority(String? status) {
    switch (status) {
      case "Low":
        return IssuePriority.LOW;
      case "Medium":
        return IssuePriority.MEDIUM;
         case "High":
        return IssuePriority.HIGH;
        case "Critical":
        return IssuePriority.CRITICAL;
      default:
        return IssuePriority.LOW;
    }
  }

  static String priorityToString(IssuePriority? status) {
    switch (status) {
      case IssuePriority.LOW:
        return "Low";
      case IssuePriority.MEDIUM:
        return "Medium";
         case IssuePriority.HIGH:
        return "High";
        case IssuePriority.CRITICAL:
        return "Critical";
      default:
        return "Low";
    }
  }


  static IssueCategory mapJsonToCategory(String? status) {
    switch (status) {
      case "general":
        return IssueCategory.GENERAL;
      case "labels":
        return IssueCategory.LABEL;
         case "images":
        return IssueCategory.IMAGE;
        case "image labelling":
        return IssueCategory.IMAGE_LABELLING;
        case "models":
        return IssueCategory.MODELS;
        case "misc":
        return IssueCategory.MISC;
      default:
        return IssueCategory.GENERAL;
    }
  }

  static String categoryToString(IssueCategory? status) {
    switch (status) {
      case IssueCategory.GENERAL:
        return "General";
      case IssueCategory.LABEL:
        return "Labels";
         case IssueCategory.IMAGE:
        return "Images";
        case IssueCategory.IMAGE_LABELLING:
        return "Labelling";
        case IssueCategory.MODELS:
        return "Models";
         case IssueCategory.MISC:
        return "Misc";
      default:
        return "";
    }
  }
}
