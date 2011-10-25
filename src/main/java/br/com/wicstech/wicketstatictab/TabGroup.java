package br.com.wicstech.wicketstatictab;

import java.util.Arrays;

import org.apache.wicket.AttributeModifier;
import org.apache.wicket.ResourceReference;
import org.apache.wicket.markup.html.IHeaderContributor;
import org.apache.wicket.markup.html.IHeaderResponse;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.list.ListItem;
import org.apache.wicket.markup.html.list.ListView;
import org.apache.wicket.markup.html.panel.Panel;
import org.apache.wicket.model.Model;

/**
 * Grupo de abas.
 * @author Sergio
 *
 */
public class TabGroup extends Panel implements IHeaderContributor{
	private static final long serialVersionUID = 7472888933369223925L;
	
	private static final ResourceReference JS_PROTOTYPE = new ResourceReference(TabGroup.class, "libraries/prototype.js"),
	JS_ABAS = new ResourceReference(TabGroup.class, "js/abas.js");
	private Tab[] tabs;

	
	public TabGroup(String id, Tab ... tabs) {
		super(id);
		this.tabs = tabs;
		add(new ListView<Tab>("botoesAbasIt", Arrays.asList(tabs)){
			private static final long serialVersionUID = 7681016248892904914L;

			@Override
			protected void populateItem(ListItem<Tab> item) {
				Tab tab = item.getModelObject();
				Label labelBotao = new Label("botao", tab.getTabName());
				labelBotao.add(new AttributeModifier("id", true, new Model<String>(tab.getBotaoId())));
				item.add(labelBotao);
			}
		});
	}


	public void renderHead(IHeaderResponse response) {
		response.renderJavascriptReference(JS_PROTOTYPE, "prototype");
		response.renderJavascriptReference(JS_ABAS, "abas");
		StringBuilder builder = new StringBuilder("Event.observe(window, \"load\", FactoryAbas.getNewAba.bind(FactoryAbas, \"");
		for (Tab tab : tabs) {
			builder.append(tab.getBotaoId());
			builder.append(',');
			builder.append(tab.getIdConteudo());
			builder.append(';');
		}
		builder.append("\"));");
		response.renderJavascript(builder, "abasBuilder");
	}
}
