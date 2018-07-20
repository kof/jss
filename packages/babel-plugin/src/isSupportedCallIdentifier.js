import * as t from 'babel-types'

export default (callPath, identifiers) => {
  // createStyleSheet() ||  jss.createStyleSheet()
  const identifier = callPath.node.callee.name || callPath.node.callee.property.name

  // Check if function call with a white-listed identifier is found.
  const conf = identifiers.filter(def => def.functions.includes(identifier))[0]

  if (!conf) return false

  let isPackageImported = false

  // Check if the package name that corresponse to the identifier is found in
  // imports.
  callPath.findParent(programPath => {
    if (!t.isProgram(programPath)) return
    programPath.traverse({
      ImportDeclaration(importPath) {
        if (conf.package.test(importPath.node.source.value)) {
          isPackageImported = true
          importPath.stop()
        }
      }
    })
  })

  return isPackageImported
}
