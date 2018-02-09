{
  function clean(obj) {
    for (var propName in obj) { 
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  }
}

start
  = SPACE_EOL* definitions:(Enum / Interface / Object / Union / InputObject / Scalar / Extend)* SPACE_EOL*
    { return definitions; }

// fields start with a lowercase
Ident = $([a-z0-9_]i*)
// types start with a uppercase
TypeIdent = $([a-z0-9_]i*)
DirectiveIdent = $([a-z0-9_]i*)
DirectiveValue = $([a-z0-9_]i*)
EnumIdent = $([a-z0-9_]i*)
NumberIdent = $([.+-]?[0-9]+([.][0-9]+)?)

Enum
  = description:Comment? "enum" SPACE name:TypeIdent BEGIN_BODY values:EnumIdentList CLOSE_BODY
    { return clean({ type: "ENUM", name, description, values }); }

Interface
  = description:Comment? "interface" SPACE name:TypeIdent impl:(IMPLEMENTS interfacename:TypeIdent { return interfacename; })? BEGIN_BODY fields:FieldList CLOSE_BODY
    { return clean({ type: "INTERFACE", name, description, fields, implements: impl }); }

Scalar
  = description:CommentList? "scalar" SPACE name:TypeIdent directives:(SPACE d:DirectiveList  {return d;})? SPACE_EOL*
    { return clean({ type: "SCALAR", name, description, directives }); }

Union 
  = description:Comment? "union" SPACE name:TypeIdent EQUAL_SEP values:UnionList
    { return clean({ type: "UNION", name, description, values }); }

Object
  = description:Comment? "type" SPACE name:TypeIdent interfaces:(COLON_SEP list:TypeList { return list; })? BEGIN_BODY fields:FieldList CLOSE_BODY
    { return clean({ type: "TYPE", name, description, fields, interfaces }); }

Extend
  = description:Comment? "extend" SPACE "type" SPACE name:TypeIdent BEGIN_BODY fields:FieldList CLOSE_BODY
    { return clean({ type: "EXTEND_TYPE", name, description, fields }); }

Directive
//= "@" name:directiveName content:(!")" char:CHAR { return char; })* ")"
//"(" comment:(!")" char:CHAR { return char; })* ")" EOL_SEP
= "@" name:directiveName content:("(" SPACE_EOL* d:letters ")" { return d; })?
  { 
    if(content)
      return {name: name, content: content};
    else
      return {name: name};
  }

Comment
  = LINE_COMMENT comment:(!EOL char:CHAR { return char; })* EOL_SEP
    { return comment.join("").trim(); }
  / "/*" comment:(!"*/" char:CHAR { return char; })* "*/" EOL_SEP
    { return comment.join("").replace(/\n\s*[*]?\s*/g, " ").replace(/\s+/, " ").trim(); }

// extend type Query {
//   foos: [Foo]!
// }

// add mutations
//  type Mutation {
//     createMessage(input: MessageInput): Message
//     updateMessage(id: ID!, input: MessageInput): Message
//   }

// add subscriptions
// type Subscription {
//   commentAdded(repoFullName: String!): Comment
// }

CommentList
  = head:Comment tail:(EOL? c:Comment { return c; })*
    { return [head, ...tail].join('\n'); }

InputObject
  = description:Comment? "input" SPACE name:TypeIdent interfaces:(COLON_SEP list:TypeList { return list; })? BEGIN_BODY fields:InputFieldList CLOSE_BODY
    { return clean({ type: "INPUT", name, description, fields, interfaces }); }

ReturnType
  = type:TypeIdent required:"!"?
    { return { type, ...(required && { required: !!required }) }; }
  / "[" type:TypeIdent "]"
    { return { type, list: true }; }

TypeList
  = head:TypeIdent tail:(COMMA_SEP type:TypeIdent { return type; })*
    { return [head, ...tail]; }

UnionList
  = head:TypeIdent tail:(PIPE_SEP type:TypeIdent { return type; })*
    { return [head, ...tail]; }

Field
  = description:Comment? name:Ident args:(BEGIN_ARGS fields:FieldList CLOSE_ARGS { return fields; })? COLON_SEP type:ReturnType
    { return clean({ [name]: { ...type, ...(args && { args }), description } }); }

FieldList
  = head:Field tail:(EOL_SEP field:Field { return field; })*
    { return [head, ...tail].reduce((result, field) => ({ ...result, ...field }), {}); }

InputField
  = description:Comment? name:Ident args:(BEGIN_ARGS fields:FieldList CLOSE_ARGS { return fields; })? COLON_SEP type:ReturnType defaultValue:(EQUAL_SEP value:Literal { return value; })?
    { return clean({ [name]: { ...type, ...(args && { args }), description, defaultValue } }); }

InputFieldList
  = head:InputField tail:(EOL_SEP field:InputField { return field; })*
    { return [head, ...tail].reduce((result, field) => ({ ...result, ...field }), {}); }

EnumIdentList
  = head:EnumIdent tail:(EOL_SEP value:EnumIdent { return value; })*
    { return [head, ...tail].filter(String); }

DirectiveList
  = head:Directive tail:(SPACE value:Directive { return value; })*
    { return [head, ...tail]; }

Literal
  = StringLiteral / BooleanLiteral / NumericLiteral

StringLiteral
  = '"' chars:DoubleStringCharacter* '"' { return chars.join(""); }

DoubleStringCharacter
  = !('"' / "\\" / EOL) . { return text(); }

BooleanLiteral
  = "true"  { return true }
  / "false"  { return false }

NumericLiteral
  = value:NumberIdent { return Number(value.replace(/^[.]/, '0.')); }

directiveName "directive name"
= name:[a-z0-9_$]i*  { return name.join('') }

letters
= letters:(!')' l:. { return l;})* { return letters ? letters.join('') : ""; }

CHAR = .
LINE_COMMENT = "#" / "//"
SPACE = [ \t]+
EOL = "\n" / "\r\n" / "\r" / "\u2028" / "\u2029"
SPACE_EOL = (SPACE / EOL)+

BEGIN_BODY = SPACE_EOL* "{" SPACE_EOL*
CLOSE_BODY = SPACE_EOL* "}" SPACE_EOL*
BEGIN_ARGS = SPACE_EOL* "(" SPACE_EOL*
CLOSE_ARGS = SPACE_EOL* ")" SPACE_EOL*
IMPLEMENTS = SPACE_EOL* "implements" SPACE_EOL*

COLON_SEP = SPACE_EOL* ":" SPACE_EOL*
EQUAL_SEP = SPACE_EOL* "=" SPACE_EOL*
COMMA_SEP = SPACE_EOL* "," SPACE_EOL*
PIPE_SEP = SPACE_EOL* "|" SPACE_EOL*
EOL_SEP = SPACE* EOL SPACE*



