{
  function clean(obj) {
    for (var propName in obj) { 
      const v = obj[propName];
      if (v=== null || v === undefined) {
        delete obj[propName];
      } else {
        if(typeof v === 'object') {
            clean(v);
        }
      }
    }
    return obj;
  }
}

start
  = SPACE_EOL* definitions:(Enum / Interface / Type / Union / InputType / Scalar / Extend / Directive / Schema)* SPACE_EOL*
    { return definitions; }

// fields start with a lowercase
FieldIdent = $([a-z0-9_]i*)
// types start with a uppercase
TypeIdent = $([a-z0-9_]i*)

DirectiveIdent = $([a-z0-9_]i*)
DirectiveValueIdent = $([ \'\",\[\]`~!@#$%^&*{}\\a-z0-9_]i*)

EnumIdent = $([a-z0-9_]i*)
NumberIdent = $([.+-]?[0-9]+([.][0-9]+)?)

Enum
  = description:CommentList? "enum" SPACE name:TypeIdent BEGIN_BODY values:EnumList CLOSE_BODY
    { return clean({ type: "ENUM", name, description, values }); }

Interface
  = description:CommentList? "interface" SPACE name:TypeIdent implts:(IMPLEMENTS interfacename:TypeList { return interfacename; })? BEGIN_BODY fields:FieldList? CLOSE_BODY
    { return clean({ type: "INTERFACE", name, description, fields, implements:implts }); }

Scalar
  = description:CommentList? "scalar" SPACE name:TypeIdent directives:(SPACE d:DirectiveList  {return d;})? SPACE_EOL*
    { return clean({ type: "SCALAR", name, description, directives }); }

Union 
  = description:CommentList? "union" SPACE name:TypeIdent EQUAL_SEP values:UnionList SPACE_EOL*
    { return clean({ type: "UNION", name, description, values }); }

Type
  = description:CommentList? "type" SPACE name:TypeIdent implts:(IMPLEMENTS interfacename:TypeList { return interfacename; })? BEGIN_BODY fields:FieldList? CLOSE_BODY
    { return clean({ type: "TYPE", name, description, fields, implements:implts }); }

Schema
  = description:CommentList? "schema" BEGIN_BODY fields:FieldList CLOSE_BODY
    { return clean({ type: "SCHEMA", description, fields }); }

Extend
  = description:CommentList? "extend" SPACE "type" SPACE name:TypeIdent BEGIN_BODY fields:FieldList CLOSE_BODY
    { return clean({ type: "EXTEND_TYPE", name, description, fields }); }

Directive
  = description:CommentList? "directive" SPACE directive:DirectiveTag SPACE "on" SPACE on:DirectiveOnList SPACE_EOL*
    { return clean({ type: "DIRECTIVE", directive, description, on }); }

DirectiveTag
 = "@" name:DirectiveIdent args:(BEGIN_ARGS v:DirectiveArgString SPACE_EOL* ')' { return v; })?
   { return args? {name, args}:{name}; }

DirectiveList
  = head:DirectiveTag tail:(SPACE value:DirectiveTag { return value; })*
    { return [head, ...tail]; }

DirectiveArgString
= letters:(!')' l:CHAR { return l;})* { return letters ? letters.join('') : ""; }

// DirectiveValueList
//   = head:DirectiveValue tail:(COMMA_SEP* field:DirectiveValue { return field; })*
//     { return [head, ...tail].reduce((result, field) => ({ ...result, ...field }), {}); }

// DirectiveValue
//   = description:CommentList? name:DirectiveIdent args:(BEGIN_ARGS fields:DirectiveValueList CLOSE_ARGS { return fields; })? COLON_SEP value:DirectiveReturnValue SPACE_EOL*
//     { return clean({ [name]: { ...value, ...(args && { args }), description } }); }

// DirectiveReturnValue = value:DirectiveValueIdent  { return { value }; }

Comment
  = LINE_COMMENT comment:(!EOL char:CHAR { return char; })* EOL_SEP*
    { return comment.join("").trim(); }
  / "/*" comment:(!"*/" char:CHAR { return char; })* "*/" EOL_SEP*
    { return comment.join("").replace(/\n\s*[*]?\s*/g, " ").replace(/\s+/, " ").trim(); }
  / "\"\"\"" comment:(!"\"\"\"" char:CHAR { return char; })* "\"\"\"" EOL_SEP*
    { return comment.join("").replace(/\n\s*[*]?\s*/g, " ").replace(/\s+/, " ").trim(); }
CommentList
  = head:Comment tail:(EOL? c:Comment { return c; })*
    { return [head, ...tail].join('\n'); }

InputType
  = description:CommentList? "input" SPACE name:TypeIdent interfaces:(COLON_SEP list:TypeList { return list; })? BEGIN_BODY fields:InputFieldList CLOSE_BODY
    { return clean({ type: "INPUT", name, description, fields, interfaces }); }

ReturnType
  = a:ArrayType
      /  type:TypeIdent required:"!"? { return { type,  ...(required && { required: !!required }) } }

ArrayType
  = "[" type:ReturnType "]" required:"!"? { return { type, array: true, ...(required && { required: !!required }) } }

TypeList
  = head:TypeIdent tail:(COMMA_SEP type:TypeIdent { return type; } )*
    { return [head, ...tail]; }

UnionList
  = head:TypeIdent tail:(PIPE_SEP type:TypeIdent { return type; })*
    { return [head, ...tail]; }

Field
  = description:CommentList? name:FieldIdent args:(BEGIN_ARGS fields:ArgsList CLOSE_ARGS { return fields; })? COLON_SEP type:ReturnType defaultValue:(EQUAL_SEP v:Literal { return v; })? directives:(SPACE d:DirectiveList  {return d;})? SPACE_EOL*
    { return clean({ [name]: { ...type, ...(args && { args }), description, defaultValue, directives } }); }

ArgsList
  = head:Field tail:(COMMA_SEP* field:Field { return field; })*
    { return [head, ...tail].reduce((result, field) => ({ ...result, ...field }), {}); }

FieldList
  = head:Field tail:(EOL_SEP* field:Field { return field; })*
    { return [head, ...tail].reduce((result, field) => ({ ...result, ...field }), {}); }

InputField
  = description:CommentList? name:FieldIdent args:(BEGIN_ARGS fields:FieldList CLOSE_ARGS { return fields; })? COLON_SEP type:ReturnType defaultValue:(EQUAL_SEP v:Literal { return v; })?
    { return clean({ [name]: { ...type, ...(args && { args }), description, defaultValue } }); }

InputFieldList
  = head:InputField tail:(EOL_SEP* field:InputField { return field; })*
    { return [head, ...tail].reduce((result, field) => ({ ...result, ...field }), {}); }

EnumValue
  = description:CommentList? name:EnumIdent
 		{ return {...(description && { description }), name }; }
 
EnumList
  = head:EnumValue tail:(SPACE_EOL value:EnumValue { return value; })*
    { return [head, ...tail].slice(0,-1); }


DirectiveOnList
  = head:DirectiveOn tail:(PIPE_SEP value:DirectiveOn { return value; })*
    { return [head, ...tail]; }

Literal
  = StringLiteral / BooleanLiteral / NumericLiteral / EOLLiteral

EOLLiteral
  = chars:DoubleEOLCharacter* { return chars.join(''); }

StringLiteral
  = '"' chars:DoubleStringCharacter* '"' { return chars.join(''); }

DoubleEOLCharacter
  = !(EOL) . { return text(); }

DoubleStringCharacter
  = !('"' / "\\" / EOL) . { return text(); }

BooleanLiteral
  = "true"  { return true } / "false"  { return false }

NumericLiteral
  = value:NumberIdent { return Number(value.replace(/^[.]/, '0.')); }

DirectiveOn
= "FIELD_DEFINITION"  { return "schema" } / "FIELD"  { return "query" }

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
