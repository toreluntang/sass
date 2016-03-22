package dk.itu.sass.teame.boundary;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import org.apache.commons.io.IOUtils;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import dk.itu.sass.teame.controller.FileController;

@Path("file")
public class FileResource {
	
	@Inject
	FileController fc;
	
	
	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response recieveFile(MultipartFormDataInput input) throws IOException {

		Map<String, List<InputPart>> maps = input.getFormDataMap();
		List<InputPart> f = maps.get("file");

		MultivaluedMap<String, String> mv = f.get(0).getHeaders();
		
		//Hijacking filenames xD Timestamp/uuid to fix - but it's a cool feature.
		String filename = getFileName(mv);
		
		InputStream is = f.get(0).getBody(InputStream.class, null);
		byte[] barr = IOUtils.toByteArray(is);
		java.nio.file.Path p = Paths.get("fakestagram","images",filename);//#fail
		Files.deleteIfExists(p); //#fail
		Files.createDirectories(p.getParent());//#fail
		java.nio.file.Path sti = Files.write(p, barr, StandardOpenOption.CREATE_NEW);//#fail
		
		fc.fuckemallup(1L,sti);
		
		return Response.ok().build();
	}
	
	private String getFileName(MultivaluedMap<String, String> header) {

		String[] contentDisposition = header.getFirst("Content-Disposition").split(";");
		
		for (String filename : contentDisposition) {
			if ((filename.trim().startsWith("filename"))) {

				String[] name = filename.split("=");
				
				String finalFileName = name[1].trim().replaceAll("\"", "");
				return finalFileName;
			}
		}
		return "unknown";
	}

}
