package dk.itu.sass.teame.boundary;

import javax.inject.Inject;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import dk.itu.sass.teame.controller.CommentController;

@Path("comment")
@Produces(MediaType.APPLICATION_JSON)
public class CommentResource {
	
	@Inject
	private CommentController commentController;
	

	public Response addComment(
			@FormParam("comment") String comment, 
			@FormParam("userId")  long userId,
			@FormParam("imageId") long imageId
			){
		
		commentController.addComment(comment, userId, imageId);
		
		
		return null;
	}

	public Response getImageComments(
			@FormParam("imageId") long pictureId) {
		
		return null;
	}

}
