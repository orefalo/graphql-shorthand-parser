start
= DirectiveList

DirectiveList
  = head:Directive tail:(wscr* value:Directive { return value; })*
    { return [head, ...tail]; }
    
Directive
= "@" name:directiveName
  props:("(" wscr* props:letters wscr* ")" { return props })?
  { return {name: name, props: props} }

directiveName "directive name"
= name:[a-z0-9_$]i* { return name.join('') }

letters
= letters:letter* { return letters ? letters.join('') : ""; }

letter
= (!')' letter:. { return letter;})

wscr "whitespace"
= [ \t\r\n]