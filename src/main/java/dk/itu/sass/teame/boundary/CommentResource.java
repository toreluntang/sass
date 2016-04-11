package dk.itu.sass.teame.boundary;

import javax.inject.Inject;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import dk.itu.sass.teame.controller.AccountController;
import dk.itu.sass.teame.controller.CommentController;
import dk.itu.sass.teame.controller.AuthProcessor;
import dk.itu.sass.teame.entity.Account;

@Path("protected/comment")
@Produces(MediaType.APPLICATION_JSON)
public class CommentResource {
	
	@Inject
	private CommentController commentController;
	
	@POST
	public Response addComment(
			@FormParam("comment") String comment, 
			@FormParam("userId")  long userId,
			@FormParam("imageId") long imageId,
			@Context ContainerRequestContext requestContext
			){
		Account user = AccountController.getAccountById(userId);
		if (AuthProcessor.Authenticate(requestContext, user.getPassword(), user.getUsername())) {
			
			long c = commentController.addComment(comment, userId, imageId);
			return Response.status(Response.Status.ACCEPTED).entity(c).build();
		}
		else {
			return Response.status(Response.Status.UNAUTHORIZED).build();
		}
	}

	@GET
	public Response getImageComments(
			@QueryParam("imageId") long imageId) {
		
		String json = commentController.getComments(imageId);
		
		return Response.status(Response.Status.ACCEPTED).entity(json).build();
	}

}
