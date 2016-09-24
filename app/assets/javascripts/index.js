$(document).ready(() => {
  const index = new Index()
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
    this.handleUpdateQuality()
    this.handleEdit()
  }

  createIdeas() {
    const title = $("#title")[0].value
    const body = $("#body")[0].value
    $("#title")[0].value = ''
    $("#body")[0].value = ''
    this.postIdea(body, title)
  }

  postIdea(body, title) {
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

  handleEdit() {
    $("#ideas").on('click', "#body", e => {
      $(e.toElement).focus().blur(e => {
        const { ideaId, idea, text } = this.returnNeededAttrs(e)
        const tag = e.target.tagName
        if (tag === "H2") {
          idea.body = text
          this.updateIdea(idea, ideaId)
        }
      })
    })

    $("#ideas").on('click', "#title", e => {
      $(e.toElement).blur(e => {
        const { ideaId, idea, text } = this.returnNeededAttrs(e)
        const tag = e.target.tagName
        if (tag === "H1") {
          idea.title = text
          this.updateIdea(idea, ideaId)
        }
      })
    })
  }

  handleUpdateQuality(e) {
    $('#ideas').on('click', "#button", e => {
      const { ideaId, idea, text } = this.returnNeededAttrs(e)
      const tag = e.target.tagName.includes("H")
      if (text === 'Up' && !tag) idea.quality = this.up[idea.quality]
      if (text === 'Down' && !tag) idea.quality = this.down[idea.quality]
      if (text === 'Delete' && !tag) this.deleteIdea(ideaId)
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

  returnNeededAttrs(e) {
    const ideaId = +e.target.parentElement.dataset.id
    const idea = this.ideas.filter(e => e.id === ideaId)[0]
    const text = e.target.textContent
    return {ideaId: ideaId, idea: idea, text: text}
  }

  generateIdeasInHtml() {
    return this.ideas.map(idea =>
      `
      <div id="idea" data-id=${idea.id}>
      <h1 contenteditable="true" id="title">${idea.title}</h1>
      <h2 contenteditable="true" id="body">${idea.body}</h2>
      <h3>${idea.quality}</h3>
      <button id="button">Up</button>
      <button id="button">Down</button>
      <button id="button">Delete</button>
      <hr>
      </div>
      `
    ).join('')
  }

  appendTo(ideas) {
    $('#ideas').html(ideas)
  }
}
