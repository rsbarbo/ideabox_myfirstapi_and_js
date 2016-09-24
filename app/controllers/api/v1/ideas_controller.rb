class Api::V1::IdeasController < ApplicationController

  def index
    render json: Idea.all
  end

end
