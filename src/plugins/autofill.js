export default {
  install (app) {
    app.directive('no-autofill', {
      mounted (el) {
        const lock = input => {
          input.setAttribute('readonly', '')
          input.addEventListener('focus', () => input.removeAttribute('readonly'))
        }
        for (const input of el.querySelectorAll('input, textarea, select')) {
          lock(input)
        }
        const observer = new MutationObserver(mutations => {
          for (const { addedNodes } of mutations) {
            for (const node of addedNodes) {
              if (node.nodeType !== 1) continue
              if (node.matches('input, textarea, select')) lock(node)
              for (const input of (node.querySelectorAll?.('input, textarea, select') ?? [])) {
                lock(input)
              }
            }
          }
        })
        observer.observe(el, { childList: true, subtree: true })
      },
    })
  },
}
