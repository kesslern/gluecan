import React from 'react'
import deburr from 'lodash/deburr'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'

const suggestions = [
  { label: '1C', language: '1c' },
  { label: 'ABNF', language: 'abnf' },
  { label: 'Access logs', language: 'accesslog' },
  { label: 'Ada', language: 'ada' },
  { label: 'ARM assembler', language: 'armasm' },
  { label: 'AVR assembler', language: 'avrasm' },
  { label: 'ActionScript', language: 'actionscript' },
  { label: 'Apache', language: 'apache' },
  { label: 'AppleScript', language: 'applescript' },
  { label: 'AsciiDoc', language: 'asciidoc' },
  { label: 'AspectJ', language: 'aspectj' },
  { label: 'AutoHotkey', language: 'autohotkey' },
  { label: 'AutoIt', language: 'autoit' },
  { label: 'Awk', language: 'awk' },
  { label: 'Axapta', language: 'axapta' },
  { label: 'Bash', language: 'bash' },
  { label: 'Basic', language: 'basic' },
  { label: 'BNF', language: 'bnf' },
  { label: 'Brainfuck', language: 'brainfuck' },
  { label: 'C#', language: 'cs' },
  { label: 'C++', language: 'cpp' },
  { label: 'C/AL', language: 'cal' },
  { label: 'Cache Object Script', language: 'cos' },
  { label: 'CMake', language: 'cmake' },
  { label: 'Coq', language: 'coq' },
  { label: 'CSP', language: 'csp' },
  { label: 'CSS', language: 'css' },
  { label: 'Cap’n Proto', language: 'capnproto' },
  { label: 'Clojure', language: 'clojure' },
  { label: 'CoffeeScript', language: 'coffeescript' },
  { label: 'Crmsh', language: 'crmsh' },
  { label: 'Crystal', language: 'crystal' },
  { label: 'D', language: 'd' },
  { label: 'DNS Zone file', language: 'dns' },
  { label: 'DOS', language: 'dos' },
  { label: 'Dart', language: 'dart' },
  { label: 'Delphi', language: 'delphi' },
  { label: 'Diff', language: 'diff' },
  { label: 'Django', language: 'django' },
  { label: 'Dockerfile', language: 'dockerfile' },
  { label: 'dsconfig', language: 'dsconfig' },
  { label: 'DTS (Device Tree)', language: 'dts' },
  { label: 'Dust', language: 'dust' },
  { label: 'EBNF', language: 'ebnf' },
  { label: 'Elixir', language: 'elixir' },
  { label: 'Elm', language: 'elm' },
  { label: 'Erlang', language: 'erlang' },
  { label: 'Excel', language: 'excel' },
  { label: 'F#', language: 'fsharp' },
  { label: 'FIX', language: 'fix' },
  { label: 'Fortran', language: 'fortran' },
  { label: 'G-Code', language: 'gcode' },
  { label: 'Gams', language: 'gams' },
  { label: 'GAUSS', language: 'gauss' },
  { label: 'Gherkin', language: 'gherkin' },
  { label: 'Go', language: 'go' },
  { label: 'Golo', language: 'golo' },
  { label: 'Gradle', language: 'gradle' },
  { label: 'Groovy', language: 'groovy' },
  { label: 'HTML, XML', language: 'xml' },
  { label: 'HTTP', language: 'http' },
  { label: 'Haml', language: 'haml' },
  { label: 'Handlebars', language: 'handlebars' },
  { label: 'Haskell', language: 'haskell' },
  { label: 'Haxe', language: 'haxe' },
  { label: 'Hy', language: 'hy' },
  { label: 'Ini', language: 'ini' },
  { label: 'Inform7', language: 'inform7' },
  { label: 'IRPF90', language: 'irpf90' },
  { label: 'JSON', language: 'json' },
  { label: 'Java', language: 'java' },
  { label: 'JavaScript', language: 'javascript' },
  { label: 'Leaf', language: 'leaf' },
  { label: 'Lasso', language: 'lasso' },
  { label: 'Less', language: 'less' },
  { label: 'LDIF', language: 'ldif' },
  { label: 'Lisp', language: 'lisp' },
  { label: 'LiveCode Server', language: 'livecodeserver' },
  { label: 'LiveScript', language: 'livescript' },
  { label: 'Lua', language: 'lua' },
  { label: 'Makefile', language: 'makefile' },
  { label: 'Markdown', language: 'markdown' },
  { label: 'Mathematica', language: 'mathematica' },
  { label: 'Matlab', language: 'matlab' },
  { label: 'Maxima', language: 'maxima' },
  { label: 'Maya Embedded Language', language: 'mel' },
  { label: 'Mercury', language: 'mercury' },
  { label: 'Mizar', language: 'mizar' },
  { label: 'Mojolicious', language: 'mojolicious' },
  { label: 'Monkey', language: 'monkey' },
  { label: 'Moonscript', language: 'moonscript' },
  { label: 'N1QL', language: 'n1ql' },
  { label: 'NSIS', language: 'nsis' },
  { label: 'Nginx', language: 'nginx' },
  { label: 'Nimrod', language: 'nimrod' },
  { label: 'Nix', language: 'nix' },
  { label: 'OCaml', language: 'ocaml' },
  { label: 'Objective C', language: 'objectivec' },
  { label: 'OpenGL Shading Language', language: 'glsl' },
  { label: 'OpenSCAD', language: 'openscad' },
  { label: 'Oracle Rules Language', language: 'ruleslanguage' },
  { label: 'Oxygene', language: 'oxygene' },
  { label: 'PF', language: 'pf' },
  { label: 'PHP', language: 'php' },
  { label: 'Parser3', language: 'parser3' },
  { label: 'Perl', language: 'perl' },
  { label: 'Pony', language: 'pony' },
  { label: 'PowerShell', language: 'powershell' },
  { label: 'Processing', language: 'processing' },
  { label: 'Prolog', language: 'prolog' },
  { label: 'Protocol Buffers', language: 'protobuf' },
  { label: 'Puppet', language: 'puppet' },
  { label: 'Python', language: 'python' },
  { label: 'Python profiler results', language: 'profile' },
  { label: 'Q', language: 'k' },
  { label: 'QML', language: 'qml' },
  { label: 'R', language: 'r' },
  { label: 'RenderMan RIB', language: 'rib' },
  { label: 'RenderMan RSL', language: 'rsl' },
  { label: 'Roboconf', language: 'graph' },
  { label: 'Ruby', language: 'ruby' },
  { label: 'Rust', language: 'rust' },
  { label: 'SCSS', language: 'scss' },
  { label: 'SQL', language: 'sql' },
  { label: 'STEP Part 21', language: 'p21' },
  { label: 'Scala', language: 'scala' },
  { label: 'Scheme', language: 'scheme' },
  { label: 'Scilab', language: 'scilab' },
  { label: 'Shell', language: 'shell' },
  { label: 'Smali', language: 'smali' },
  { label: 'Smalltalk', language: 'smalltalk' },
  { label: 'Stan', language: 'stan' },
  { label: 'Stata', language: 'stata' },
  { label: 'Stylus', language: 'stylus' },
  { label: 'SubUnit', language: 'subunit' },
  { label: 'Swift', language: 'swift' },
  { label: 'Test Anything Protocol', language: 'tap' },
  { label: 'Tcl', language: 'tcl' },
  { label: 'TeX', language: 'tex' },
  { label: 'Thrift', language: 'thrift' },
  { label: 'TP', language: 'tp' },
  { label: 'Twig', language: 'twig' },
  { label: 'TypeScript', language: 'typescript' },
  { label: 'VB.Net', language: 'vbnet' },
  { label: 'VBScript', language: 'vbscript' },
  { label: 'VHDL', language: 'vhdl' },
  { label: 'Vala', language: 'vala' },
  { label: 'Verilog', language: 'verilog' },
  { label: 'Vim Script', language: 'vim' },
  { label: 'x86 Assembly', language: 'x86asm' },
  { label: 'XL', language: 'xl' },
  { label: 'XQuery', language: 'xpath' },
  { label: 'Zephir', language: 'zephir' },
]

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node)
          inputRef(node)
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  )
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query)
  const parts = parse(suggestion.label, matches)

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span
            key={part.text}
            style={{ fontWeight: part.highlight ? 500 : 400 }}
          >
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  )
}

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase()
  const inputLength = inputValue.length
  let count = 0

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue

        if (keep) {
          count += 1
        }

        return keep
      })
}

function getSuggestionValue(suggestion) {
  return suggestion.label
}

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: 'auto',
    maxWidth: 300,
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing(2),
  },
}))

export default function IntegrationAutosuggest({ onSelect }) {
  const classes = useStyles()
  const [state, setState] = React.useState('')
  const [stateSuggestions, setSuggestions] = React.useState([])

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value))
  }

  const handleSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  const handleChange = (event, { newValue }) => {
    setState(newValue)
  }

  const handleSuggestionSelected = (event, { suggestionValue }) => {
    event.preventDefault()
    const { language } = suggestions.find(it => it.label === suggestionValue)
    onSelect(language)
  }

  const autosuggestProps = {
    renderInputComponent,
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    onSuggestionSelected: handleSuggestionSelected,
    getSuggestionValue,
    renderSuggestion,
  }

  return (
    <div className={classes.root}>
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          id: 'react-autosuggest-simple',
          label: 'Language (optional)',
          variant: 'outlined',
          placeholder: 'Search for a language...',
          value: state,
          onChange: handleChange,
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
    </div>
  )
}
