$(document).ready(() => {
  const index = new Index()
  index.handleUpdateQuality()
})

class Index {
  constructor() {
    this.up = {
      swill: "plausible",
      plausible: 'genius',
      genius: 'genius'
    }
    this.down = {
      genius: 'plausible',
      plausible: 'swill',
      swill: 'swill'
    }
    this.ideas = []
    this.getIdeas()
    this.handleSubmit()
  }

  createIdeas() {
    const title = $("#title")[0].value
    const body = $("#body")[0].value
    $.ajax({
      type: "POST",
      url: '/api/v1/ideas',
      data: {
        title: title,
        body: body,
        quality: "swill"
      },
      success: response => {
        this.getIdeas()
      }
    })
  }

  handleSubmit() {
    $("#submit-idea").on("click", () => {
      this.createIdeas()
    })
  }

  deleteIdea(id) {
    $.ajax({
      type: "DELETE",
      url: `api/v1/ideas/${id}`,
      success: response => {
        this.getIdeas()
      }
    })
  }

  getIdeas() {
    $.getJSON('/api/v1/ideas')
    .then(response => {
      this.ideas = response.sort((a, b) => a.id < b.id)
      const validHTML = this.generateIdeasInHtml(response)
      this.appendTo(validHTML)
    })
  }

  handleUpdateQuality(e) {
    $('#ideas').on('click', e => {
      const ideaId = +e.target.parentElement.dataset.id
      const idea = this.ideas.filter(e => e.id === ideaId)[0]
      const buttonText = e.target.textContent
      if (buttonText === 'Up') idea.quality = this.up[idea.quality]
      if (buttonText === 'Down') idea.quality = this.down[idea.quality]
      if (buttonText === 'Delete') this.deleteIdea(ideaId)
      this.updateIdea(idea, ideaId)
    })
  }

  updateIdea(idea, id) {
    $.ajax({
      type: "PATCH",
      url: `/api/v1/ideas/${id}`,
      data: idea,
      success: response => {
        this.getIdeas()
      }
    })
  }

  generateIdeasInHtml() {
    return this.ideas.map(idea =>
      `
      <div id="idea" data-id=${idea.id}>
      <h1>${idea.title}</h1>
      <h2>${idea.body}</h2>
      <h3>${idea.quality}</h3>
      <button>Up</button>
      <button>Down</button>
      <button>Delete</button>
      <hr>
      </div>
      `
    ).join('')
  }

  appendTo(ideas) {
    $('#ideas').html(ideas)
  }
}
