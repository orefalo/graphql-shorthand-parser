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
  = SPACES_EOL* definitions:(Enum / Interface / Type / Union / InputType / Scalar / Extend / Directive / Schema / CommentList)* SPACES_EOL*
    { return definitions; }

// fields start with a lowercase
FieldIdent = $([a-zA-Z0-9_]+)
// types start with a uppercase
TypeIdent = $([a-zA-Z0-9_]+)

DirectiveIdent = $([a-zA-Z0-9_]*)
DirectiveValueIdent = $([ \'\",\[\]`~!@#$%^&*{}\\a-zA-Z0-9_]*)

EnumIdent = $([a-zA-Z0-9_]*)
NumberIdent = $([.+-]?[0-9]+([.][0-9]+)?)

Enum
  = description:CommentList? "enum" SPACES name:TypeIdent BEGIN_BODY values:EnumList CLOSE_BODY
    { return clean({ type: "ENUM", name, description, values }); }

Interface
  = description:CommentList? "interface" SPACES name:TypeIdent implts:(IMPLEMENTS interfacename:TypeList { return interfacename; })? BEGIN_BODY fields:FieldList? CLOSE_BODY
    { return clean({ type: "INTERFACE", name, description, fields, implements:implts }); }

Scalar
  = description:CommentList? "scalar" SPACES name:TypeIdent directives:(SPACES d:DirectiveList  {return d;})? SPACES_EOL*
    { return clean({ type: "SCALAR", name, description, directives }); }

Union 
  = description:CommentList? "union" SPACES name:TypeIdent EQUAL_SEP values:UnionList SPACES_EOL*
    { return clean({ type: "UNION", name, description, values }); }

Type
  = description:CommentList? "type" SPACES name:TypeIdent implts:(IMPLEMENTS interfacename:TypeList { return interfacename; })? BEGIN_BODY fields:FieldList? CLOSE_BODY
    { return clean({ type: "TYPE", name, description, fields, implements:implts }); }

Schema
  = description:CommentList? "schema" BEGIN_BODY fields:FieldList CLOSE_BODY
    { return clean({ type: "SCHEMA", description, fields }); }

Extend
  = description:CommentList? "extend" SPACES "type" SPACES name:TypeIdent BEGIN_BODY fields:FieldList CLOSE_BODY
    { return clean({ type: "EXTEND_TYPE", name, description, fields }); }

Directive
  = description:CommentList? "directive" SPACES directive:DirectiveTag SPACES "on" SPACES on:DirectiveOnList SPACES_EOL*
    { return clean({ type: "DIRECTIVE", directive, description, on }); }

DirectiveTag
 = "@" name:DirectiveIdent args:(BEGIN_ARGS v:DirectiveArgString SPACES_EOL* ')' { return v; })?
   { return args? {name, args}:{name}; }

DirectiveList
  = head:DirectiveTag tail:(SPACES value:DirectiveTag { return value; })*
    { return [head, ...tail]; }

DirectiveArgString
= letters:(!')' l:CHAR { return l;})* { return letters ? letters.join('') : ""; }

// DirectiveValueList
//   = head:DirectiveValue tail:(COMMA_SEP* field:DirectiveValue { return field; })*
//     { return [head, ...tail].reduce((result, field) => ({ ...result, ...field }), {}); }

// DirectiveValue
//   = description:CommentList? name:DirectiveIdent args:(BEGIN_ARGS fields:DirectiveValueList CLOSE_ARGS { return fields; })? COLON_SEP value:DirectiveReturnValue SPACES_EOL*
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
  = description:CommentList? "input" SPACES name:TypeIdent interfaces:(COLON_SEP list:TypeList { return list; })? BEGIN_BODY fields:InputFieldList CLOSE_BODY
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
  = description:CommentList? name:FieldIdent args:(BEGIN_ARGS fields:ArgsList CLOSE_ARGS { return fields; })? COLON_SEP type:ReturnType defaultValue:(EQUAL_SEP v:Literal { return v; })? directives:(SPACES d:DirectiveList  {return d;})? SPACES_EOL*
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
  = head:EnumValue tail:(SPACES_EOL value:EnumValue { return value; })*
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
SPACE = [ \t]
SPACES = SPACE+
EOL = "\n" / "\r\n" / "\r" / "\u2028" / "\u2029"
SPACES_EOL = (SPACE / EOL)+

BEGIN_BODY = SPACES_EOL* "{" SPACES_EOL*
CLOSE_BODY = SPACES_EOL* "}" SPACES_EOL*
BEGIN_ARGS = SPACES_EOL* "(" SPACES_EOL*
CLOSE_ARGS = SPACES_EOL* ")" SPACES_EOL*
IMPLEMENTS = SPACES_EOL* "implements" SPACES_EOL*

COLON_SEP = SPACES_EOL* ":" SPACES_EOL*
EQUAL_SEP = SPACES_EOL* "=" SPACES_EOL*
COMMA_SEP = SPACES_EOL* "," SPACES_EOL*
PIPE_SEP = SPACES_EOL* "|" SPACES_EOL*
EOL_SEP = SPACES* EOL SPACES*
