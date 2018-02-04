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
  = WS* definitions:(Enum / Interface / Object / Union / InputObject / Scalar / Extend)* WS*
    { return definitions; }

Ident = $([a-z]([a-z0-9_]i)*)
TypeIdent = $([A-Z]([a-z0-9_]i)*)
EnumIdent = $([A-Z][A-Z0-9_]*)
NumberIdent = $([.+-]?[0-9]+([.][0-9]+)?)

Enum
  = description:Comment? "enum" SPACE name:TypeIdent BEGIN_BODY values:EnumIdentList CLOSE_BODY
    { return clean({ type: "ENUM", name, ...(description && { description }), values }); }

Interface
  = description:Comment? "interface" SPACE name:TypeIdent impl:(IMPLEMENTS interfacename:TypeIdent { return interfacename; })? BEGIN_BODY fields:FieldList CLOSE_BODY
    { return clean({ type: "INTERFACE", name, ...(description && { description }), fields, implements: impl }); }

Scalar
  = description:Comment? "scalar" SPACE name:TypeIdent
    { return clean({ type: "SCALAR", name, ...(description && { description }) }); }

Union 
  = description:Comment? "union" SPACE name:TypeIdent EQUAL values:UnionList
    { return clean({ type: "UNION", name, ...(description && { description }), values }); }

Object
  = description:Comment? "type" SPACE name:TypeIdent interfaces:(COLON list:TypeList { return list; })? BEGIN_BODY fields:FieldList CLOSE_BODY
    { return clean({ type: "TYPE", name, ...(description && { description }), fields, ...(interfaces && { interfaces }) }); }

Extend
  = description:Comment? "extend" SPACE "type" SPACE name:TypeIdent BEGIN_BODY fields:FieldList CLOSE_BODY
    { return clean({ type: "EXTEND_TYPE", name, ...(description && { description }), fields }); }


  // extend type Query {
  //   foos: [Foo]!
  // }

// add mutations
//  type Mutation {
//     createMessage(input: MessageInput): Message
//     updateMessage(id: ID!, input: MessageInput): Message
//   }
//
// add subscriptions
// type Subscription {
//   commentAdded(repoFullName: String!): Comment
// }

InputObject
  = description:Comment? "input" SPACE name:TypeIdent interfaces:(COLON list:TypeList { return list; })? BEGIN_BODY fields:InputFieldList CLOSE_BODY
    { return { type: "INPUT", name, ...(description && { description }), fields, ...(interfaces && { interfaces }) }; }

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
  = description:Comment? name:Ident args:(BEGIN_ARGS fields:FieldList CLOSE_ARGS { return fields; })? COLON type:ReturnType
    { return { [name]: { ...type, ...(args && { args }), ...(description && { description }) } }; }

FieldList
  = head:Field tail:(EOL_SEP field:Field { return field; })*
    { return [head, ...tail].reduce((result, field) => ({ ...result, ...field }), {}); }

InputField
  = description:Comment? name:Ident args:(BEGIN_ARGS fields:FieldList CLOSE_ARGS { return fields; })? COLON type:ReturnType defaultValue:(EQUAL value:Literal { return value; })?
    { return { [name]: { ...type, ...(args && { args }), ...(description && { description }), ...(defaultValue && { defaultValue }) } }; }

InputFieldList
  = head:InputField tail:(EOL_SEP field:InputField { return field; })*
    { return [head, ...tail].reduce((result, field) => ({ ...result, ...field }), {}); }

EnumIdentList
  = head:EnumIdent tail:(EOL_SEP value:EnumIdent { return value; })*
    { return [head, ...tail]; }

Comment
  = LINE_COMMENT comment:(!EOL char:CHAR { return char; })* EOL_SEP
    { return comment.join("").trim(); }
  / "/*" comment:(!"*/" char:CHAR { return char; })* "*/" EOL_SEP
    { return comment.join("").replace(/\n\s*[*]?\s*/g, " ").replace(/\s+/, " ").trim(); }

// scalar AlphaNumeric @stringValue(
//   regex: "^[0-9a-zA-Z]*$"
// )
// @include(if: $show)
// @_(countBy: "gender")
// @_(get: "people") 
// type RootQuery {
//   secret: String @auth(roles: ["admin"])
// }
// type Foo {
//   byte:Integer @numberValue(
//     min: 0
//     max: 255
//   )
// }
// type Foo {
//   bitMask: Integer @numberValue(
//     oneOf: [ 1, 2, 4, 8, 16, 32, 64, 128 ]
//   )
// }
// type ticTacToe {
//   board: [[String!]!] @list(
//     minItems: 3,
//     maxItems: 3
//     innerList: {
//       minItems: 3,
//       maxItems: 3
//     }
//   ) @stringValue(oneOf: [" ","X", "O"])
// }
// hello: String @upper
// Directive
//   = 


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

LINE_COMMENT = "#" / "//"

BEGIN_BODY = WS* "{" WS*
CLOSE_BODY = WS* "}" WS*

BEGIN_ARGS = WS* "(" WS*
CLOSE_ARGS = WS* ")" WS*

IMPLEMENTS = WS* "implements" WS*

CHAR = .

WS = (SPACE / EOL)+

COLON = WS* ":" WS*
EQUAL = WS* "=" WS*

COMMA_SEP = WS* "," WS*
PIPE_SEP = WS* "|" WS*
EOL_SEP = SPACE* EOL SPACE*

SPACE = [ \t]+
EOL = "\n" / "\r\n" / "\r" / "\u2028" / "\u2029"
