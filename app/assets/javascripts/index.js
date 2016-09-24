$(document).ready(() => {
  console.log('hello');
  getIdeas()
})

const appendTo = ideas => {
  $('#ideas').html(ideas)
}

const createIdeas = ideas => {
  return ideas.map(idea => {
    return `<h1>${idea.title}</h1><h2>${idea.body}</h2>`
  }).join('')
}

const getIdeas = () => {
  $.getJSON('/api/v1/ideas')
    .then(response => {
      const validHTML = createIdeas(response)
      appendTo(validHTML)
    })
}
