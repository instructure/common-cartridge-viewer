export const CC_FILE_PREFIX = "%24IMS-CC-FILEBASE%24"; // $

export const resourceTypes = {
  WEB_CONTENT: "webcontent",
  ASSOCIATED_CONTENT:
    "associatedcontent/imscc_xmlv1p1/learning-application-resource",
  DISCUSSION_TOPIC: "imsdt_xmlv1p1",
  ASSIGNMENT: "assignment_xmlv1p0",
  WEB_LINK: "imswl_xmlv1p1",
  ASSESSMENT_CONTENT: "imsqti_xmlv1p2/imscc_xmlv1p1/assessment",
  QUESTION_BANK: "imsqti_xmlv1p2/imscc_xmlv1p1/question-bank",
  BLTI: "imsbasiclti_xmlv1p0"
};

export const questionTypes = {
  MULTIPLE_CHOICE: "cc.multiple_choice.v0p1",
  MULTIPLE_RESPONSE: "cc.multiple_response.v0p1",
  TRUEFALSE: "cc.true_false.v0p1",
  FILL_IN_THE_BLANK: "cc.fib.v0p1",
  PATTERN_MATCH: "cc.pattern_match.v0p1",
  ESSAY: "cc.essay.v0p1"
};

export const questionTypeLabels = {
  [questionTypes.MULTIPLE_CHOICE]: "Multiple choice",
  [questionTypes.MULTIPLE_RESPONSE]: "Multiple response",
  [questionTypes.TRUEFALSE]: "True / false",
  [questionTypes.FILL_IN_THE_BLANK]: "Fill in the blank",
  [questionTypes.PATTERN_MATCH]: "Pattern match",
  [questionTypes.ESSAY]: "Essay"
};
