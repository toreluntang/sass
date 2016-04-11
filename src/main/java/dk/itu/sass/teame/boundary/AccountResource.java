package dk.itu.sass.teame.boundary;

import javax.inject.Inject;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.google.gson.JsonObject;

import dk.itu.sass.teame.controller.AccountController;
import dk.itu.sass.teame.controller.AuthProcessor;
import dk.itu.sass.teame.entity.Account;

@Path("account")
@Produces(MediaType.APPLICATION_JSON)
public class AccountResource {

	@Inject
	private AccountController accountController;
	// private AccountController accController = new AccountController();

	@POST
	@Path("create")
	public Response createAccount(@FormParam("username") String username, @FormParam("password") String password,
			@FormParam("email") String email) {

		if (username == null || password == null || email == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}

		boolean usernameIsTaken = accountController.validateUsername(username);

		if (!usernameIsTaken)
			return Response.status(Response.Status.PAYMENT_REQUIRED).build();

		long result = accountController.insertAccount(username, password, email).getAccountid();

		return Response.status(Response.Status.ACCEPTED).entity(result).build();
	}

	@POST
	@Path("login")
	public Response login(@FormParam("username") String username, @FormParam("password") String password) {

		JsonObject json = new JsonObject();

		Account account = accountController.login(username, password);

		json.addProperty("id", account.getAccountid());
		if (account == null)
			return Response.status(Status.UNAUTHORIZED).build();

			return Response.ok().entity(json.toString()).build();
	}

	@GET
	@Path("getallusers")
	public Response getAllUsers() {
		// Something with authentications

		String json = accountController.getAllusers();
		return Response.ok().entity(json).build();
	}

}
