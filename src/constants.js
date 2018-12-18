export const CC_FILE_PREFIX = "%24IMS-CC-FILEBASE%24";
export const CC_FILE_PREFIX_OLD = "%24IMS_CC_FILEBASE%24"; // mistaken, replaced, but supported: https://github.com/instructure/canvas-lms/commit/d1b508676bf2713cdb09bed7145899728b102ac7
export const WIKI_REFERENCE = "%24WIKI_REFERENCE%24";
export const CANVAS_OBJECT_REFERENCE = "%24CANVAS_OBJECT_REFERENCE%24";
export const CANVAS_COURSE_REFERENCE = "%24CANVAS_COURSE_REFERENCE%24";
export const WIKI_CONTENT_HREF_PREFIX = "wiki_content";
export const ASSOCIATED_CONTENT_ASSIGNMENT_TITLE_PREFIX_REGEX = /(^Assignment: )/;

export const resourceTypes = {
  ASSESSMENT_CONTENT: "imsqti_xmlv1p2/imscc_xmlv1p1/assessment",
  ASSIGNMENT: "assignment_xmlv1p0",
  ASSOCIATED_CONTENT:
    "associatedcontent/imscc_xmlv1p1/learning-application-resource",
  BLTI: "imsbasiclti_xmlv1p0",
  DISCUSSION_TOPIC: "imsdt_xmlv1p1",
  EXTERNAL_TOOL: "external_tool",
  QUESTION_BANK: "imsqti_xmlv1p2/imscc_xmlv1p1/question-bank",
  WEB_CONTENT: "webcontent",
  WEB_LINK: "imswl_xmlv1p1"
};

export const questionTypes = {
  ESSAY: "cc.essay.v0p1",
  FILL_IN_THE_BLANK: "cc.fib.v0p1",
  MULTIPLE_CHOICE: "cc.multiple_choice.v0p1",
  MULTIPLE_RESPONSE: "cc.multiple_response.v0p1",
  PATTERN_MATCH: "cc.pattern_match.v0p1",
  TRUEFALSE: "cc.true_false.v0p1"
};

export const submissionTypes = {
  ONLINE_UPLOAD: "online_upload",
  ONLINE_TEXT_ENTRY: "online_text_entry",
  ONLINE_URL: "online_url",
  MEDIA_RECORDING: "media_recording",
  ON_PAPER: "on_paper",
  NONE: "none"
};

export const NOTORIOUS_EXTENSIONS_SUPPORTED = [
  "3gp",
  "3gp",
  "aac",
  "aiff",
  "asf",
  "avi",
  "flac",
  "flv",
  "m4v",
  "mka",
  "mkv",
  "mov",
  "mp3",
  "mp3",
  "mp4",
  "mp4",
  "mpeg",
  "mpg",
  "ogg",
  "swf",
  "swf",
  "wav",
  "wav",
  "webm",
  "webm",
  "wma",
  "wmv"
];

export const DOCUMENT_PREVIEW_EXTENSIONS_SUPPORTED = [
  "doc",
  "docx",
  "odf",
  "odg",
  "odp",
  "ods",
  "odt",
  "pdf",
  "ppt",
  "pptx",
  "rtf",
  "sxc",
  "sxi",
  "sxw",
  "xlsx",
  "xls",
  "txt"
];

export const moduleMetaContentTypes = {
  ASSIGNMENT: "Assignment",
  QUIZ: "Quizzes::Quiz",
  ATTACHMENT: "Attachment",
  WIKI_PAGE: "WikiPage",
  DISCUSSION_TOPIC: "DiscussionTopic",
  CONTEXT_MODULE_SUBHEADER: "ContextModuleSubHeade",
  EXTERNAL_URL: "ExternalUrl",
  CONTENT_EXTERNAL_TOOL: "ContextExternalTool"
};
