/**
 * b() => 'button'
 * b('text') => 'button_text'
 * b({ disable: true }) => 'button button-disabled'
 * b('text', { disabled: true }) => 'button__text button__text--disabled'
 * b(['disabled', 'primary']) => 'button button--disabled button--primary'
 */

function gen(name, mods) {
  if (!mods) {
    return ''
  }

  if (typeof mods === 'string') {
    return ` ${name}--${mods}`
  }

  if (Array.isArray(mods)) {
    return mods.reduce((ret, item) => ret + gen(name, item), '')
  }

  return Object.keys(mods).reduce((ret, key) => {
    return ret + (mods[key] ? gen(name, key) : '')
  }, '')
}

export function createBEM(name) {
  return function (el, mods) {
    if (el && typeof el !== 'string') {
      mods = el
      el = ''
    }
    el = el ? `${name}__${el}` : name

    return `${el}${gen(el, mods)}`
  }
}
