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

// fields start with a lowercase
Ident = $([a-z0-9_]i*)
// types start with a uppercase
TypeIdent = $([a-z0-9_]i*)
DirectiveIdent = $(([a-z0-9_]i)*)
DirectiveValue = $(([a-z0-9_]i)*)
EnumIdent = $(([A-Z0-9_]i)*)
NumberIdent = $([.+-]?[0-9]+([.][0-9]+)?)

Enum
  = description:Comment? "enum" SPACE name:TypeIdent BEGIN_BODY values:EnumIdentList CLOSE_BODY
    { return clean({ type: "ENUM", name, description, values }); }

Interface
  = description:Comment? "interface" SPACE name:TypeIdent impl:(IMPLEMENTS interfacename:TypeIdent { return interfacename; })? BEGIN_BODY fields:FieldList CLOSE_BODY
    { return clean({ type: "INTERFACE", name, description, fields, implements: impl }); }

Scalar
  = description:Comment? "scalar" SPACE name:TypeIdent directives:(SPACE d:DirectiveList {return d;})?
    { return clean({ type: "SCALAR", name, description, directives }); }

Union 
  = description:Comment? "union" SPACE name:TypeIdent EQUAL values:UnionList
    { return clean({ type: "UNION", name, description, values }); }

Object
  = description:Comment? "type" SPACE name:TypeIdent interfaces:(COLON list:TypeList { return list; })? BEGIN_BODY fields:FieldList CLOSE_BODY
    { return clean({ type: "TYPE", name, description, fields, ...(interfaces && { interfaces }) }); }

Extend
  = description:Comment? "extend" SPACE "type" SPACE name:TypeIdent BEGIN_BODY fields:FieldList CLOSE_BODY
    { return clean({ type: "EXTEND_TYPE", name, description, fields }); }

Directive
= "@" name:directiveName
  props:("(" wscr* props:letters wscr* ")" { return props })?
  { if(props)
      return {name: name, props: props};
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

InputObject
  = description:Comment? "input" SPACE name:TypeIdent interfaces:(COLON list:TypeList { return list; })? BEGIN_BODY fields:InputFieldList CLOSE_BODY
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
  = description:Comment? name:Ident args:(BEGIN_ARGS fields:FieldList CLOSE_ARGS { return fields; })? COLON type:ReturnType
    { return clean({ [name]: { ...type, ...(args && { args }), description } }); }

FieldList
  = head:Field tail:(EOL_SEP field:Field { return field; })*
    { return [head, ...tail].reduce((result, field) => ({ ...result, ...field }), {}); }

InputField
  = description:Comment? name:Ident args:(BEGIN_ARGS fields:FieldList CLOSE_ARGS { return fields; })? COLON type:ReturnType defaultValue:(EQUAL value:Literal { return value; })?
    { return clean({ [name]: { ...type, ...(args && { args }), description, defaultValue } }); }

InputFieldList
  = head:InputField tail:(EOL_SEP field:InputField { return field; })*
    { return [head, ...tail].reduce((result, field) => ({ ...result, ...field }), {}); }

EnumIdentList
  = head:EnumIdent tail:(EOL_SEP value:EnumIdent { return value; })*
    { return [head, ...tail].filter(String); }

DirectiveList
  = head:Directive tail:(wscr* value:Directive { return value; })*
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
= name:[a-z0-9_$]i* { return name.join('') }

letters
= letters:letter* { return letters ? letters.join('') : ""; }

letter
= (!')' letter:. { return letter;})

wscr "whitespace"
= [ \t\r\n]


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
