package dk.itu.sass.teame.boundary;

import javax.inject.Inject;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import dk.itu.sass.teame.controller.CommentController;

@Path("protected/comment")
@Produces(MediaType.APPLICATION_JSON)
public class CommentResource {
	
	@Inject
	private CommentController commentController;
	
	@POST
	public Response addComment(
			@FormParam("comment") String comment, 
			@FormParam("userId")  long userId,
			@FormParam("imageId") long imageId){
		try {
			long c = commentController.addComment(comment, userId, imageId);
			return Response.status(Response.Status.ACCEPTED).entity(c).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
	}

	@GET
	public Response getImageComments(
			@QueryParam("imageId") String imageId) {
		try {
		String json = commentController.getComments(imageId);
		
		return Response.status(Response.Status.ACCEPTED).entity(json).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
	}

}
