class Api::V1::IdeasController < ApplicationController

  def index
    render json: Idea.all
  end

  def update
    @idea = Idea.find(params[:id])
    render json: @idea.update(idea_params)
  end

  def create
    @idea = Idea.new(idea_params)
    render json: @idea.save
  end

  def destroy
    @idea = Idea.find(params[:id]).destroy
  end

  private

  def idea_params
    params.permit(:title, :body, :quality)
  end

end
