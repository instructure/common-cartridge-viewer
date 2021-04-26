export const CC_FILE_PREFIX = "%24IMS-CC-FILEBASE%24";
export const CC_FILE_PREFIX_OLD = "%24IMS_CC_FILEBASE%24"; // mistaken, replaced, but supported: https://github.com/instructure/canvas-lms/commit/d1b508676bf2713cdb09bed7145899728b102ac7
export const CC_FILE_PREFIX_DECODED = "$IMS-CC-FILEBASE$";
export const WIKI_REFERENCE = "%24WIKI_REFERENCE%24";
export const CANVAS_OBJECT_REFERENCE = "%24CANVAS_OBJECT_REFERENCE%24";
export const CANVAS_COURSE_REFERENCE = "%24CANVAS_COURSE_REFERENCE%24";
export const WIKI_CONTENT_HREF_PREFIX = "wiki_content";
export const ASSOCIATED_CONTENT_ASSIGNMENT_TITLE_PREFIX_REGEX = /(^Assignment: )/;
export const MODULE_LIST = "module_list";

export const resourceTypes = {
  ASSESSMENT_CONTENT: "imsqti_xmlv1p2/imscc_xmlv1p1/assessment",
  ASSIGNMENT: "assignment_xmlv1p0",
  ASSOCIATED_CONTENT:
    "associatedcontent/imscc_xmlv1p1/learning-application-resource",
  BLTI: "imsbasiclti_xmlv1p0",
  CANVAS_ASSESTMENT_CONTENT:
    "associatedcontent/imscc_xmlv1p1/learning-application-resource",
  DISCUSSION_TOPIC: "imsdt_xmlv1p1",
  EXTERNAL_TOOL: "external_tool",
  QUESTION_BANK: "imsqti_xmlv1p2/imscc_xmlv1p1/question-bank",
  WEB_CONTENT: "webcontent",
  WEB_LINK: "imswl_xmlv1p1"
};

export const questionTypes = {
  ESSAY: ["essay_question", "cc.essay.v0p1"],
  FILL_IN_THE_BLANK: ["cc.fib.v0p1"],
  MULTIPLE_CHOICE: ["multiple_choice_question", "cc.multiple_choice.v0p1"],
  MULTIPLE_RESPONSE: ["multiple_answers_question", "cc.multiple_response.v0p1"],
  PATTERN_MATCH: ["cc.pattern_match.v0p1"],
  TRUEFALSE: ["true_false_question", "cc.true_false.v0p1"],
  // Canvas specific types:
  MULTIPLE_DROPDOWN: ["multiple_dropdowns_question"],
  MATCH_QUESTION: ["matching_question"],
  NUMERICAL: ["numerical_question"],
  CALCULATED: ["calculated_question"],
  TEXT_ONLY: ["text_only_question"],
  FILE_UPLOAD: ["file_upload_question"]
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

export const resourceTypeToHref = {
  Modules: "#/",
  Assignments: "#/assignments",
  Pages: "#/pages",
  Discussions: "#/discussions",
  Quizzes: "#/quizzes",
  Files: "#/files"
};

// these individual imports are necessary for separate webpack bundles
export const AVAILABLE_LOCALES = {
  ar: () => import(/* webpackChunkName: "ar" */ "./locales/ar/messages.js"),
  cy: () => import(/* webpackChunkName: "cy" */ "./locales/cy/messages.js"),
  da: () => import(/* webpackChunkName: "da" */ "./locales/da/messages.js"),
  de: () => import(/* webpackChunkName: "de" */ "./locales/de/messages.js"),
  "en-au": () =>
    import(/* webpackChunkName: "en_AU" */ "./locales/en_AU/messages.js"),
  "en-gb": () =>
    import(/* webpackChunkName: "en_GB" */ "./locales/en_GB/messages.js"),
  en: () => import(/* webpackChunkName: "en" */ "./locales/en/messages.js"),
  es: () => import(/* webpackChunkName: "es" */ "./locales/es/messages.js"),
  "fr-ca": () =>
    import(/* webpackChunkName: "fr_CA" */ "./locales/fr_CA/messages.js"),
  fr: () => import(/* webpackChunkName: "fr" */ "./locales/fr/messages.js"),
  is: () => import(/* webpackChunkName: "is" */ "./locales/is/messages.js"),
  it: () => import(/* webpackChunkName: "it" */ "./locales/it/messages.js"),
  ja: () => import(/* webpackChunkName: "ja" */ "./locales/ja/messages.js"),
  "nb-no": () =>
    import(/* webpackChunkName: "nb" */ "./locales/nb/messages.js"),
  nb: () => import(/* webpackChunkName: "nb" */ "./locales/nb/messages.js"),
  nl: () => import(/* webpackChunkName: "nl" */ "./locales/nl/messages.js"),
  pl: () => import(/* webpackChunkName: "pl" */ "./locales/pl/messages.js"),
  "pt-br": () =>
    import(/* webpackChunkName: "pt_BR" */ "./locales/pt_BR/messages.js"),
  pt: () => import(/* webpackChunkName: "pt" */ "./locales/pt/messages.js"),
  ru: () => import(/* webpackChunkName: "ru" */ "./locales/ru/messages.js"),
  sv: () => import(/* webpackChunkName: "sv" */ "./locales/sv/messages.js"),
  "zh-hant": () =>
    import(/* webpackChunkName: "zh_HK" */ "./locales/zh_HK/messages.js"),
  "zh-hans": () =>
    import(/* webpackChunkName: "zh" */ "./locales/zh/messages.js"),
  "zh-hk": () =>
    import(/* webpackChunkName: "zh_HK" */ "./locales/zh_HK/messages.js"),
  zh: () => import(/* webpackChunkName: "zh" */ "./locales/zh/messages.js")
};
