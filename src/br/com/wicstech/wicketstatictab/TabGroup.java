package br.com.wicstech.wicketstatictab;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.wicket.ResourceReference;
import org.apache.wicket.markup.html.IHeaderContributor;
import org.apache.wicket.markup.html.IHeaderResponse;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.list.ListItem;
import org.apache.wicket.markup.html.list.ListView;
import org.apache.wicket.markup.html.panel.Panel;

/**
 * Grupo de abas.
 * 
 * @author Sergio
 * 
 */
public class TabGroup extends Panel implements IHeaderContributor {
	private static final long serialVersionUID = 7472888933369223925L;

	private static final ResourceReference JS_ABAS = new ResourceReference(TabGroup.class, "abas.js");
	private List<Tab> tabs;

	public TabGroup(String id, Tab... tabs) {
		super(id);
		this.tabs = new ArrayList<Tab>(Arrays.asList(tabs));
		add(new ListView<Tab>("botoesAbasIt", this.tabs) {
			private static final long serialVersionUID = 7681016248892904914L;

			@Override
			protected void populateItem(ListItem<Tab> item) {
				Tab tab = item.getModelObject();
				Label labelBotao = new Label("botao", tab.getTabName());
				labelBotao.setMarkupId(tab.getBotaoId());
				labelBotao.setOutputMarkupId(true);
				item.add(labelBotao);
			}
		});
	}

	/**
	 * Adicionar mais abas.
	 * 
	 * @param tabs
	 */
	public void addTab(Tab... tabs) {
		this.tabs.addAll(Arrays.asList(tabs));
	}

	public void renderHead(IHeaderResponse response) {
		response.renderJavascriptReference(JS_ABAS, "abas");
		StringBuilder builder = new StringBuilder("FactoryAbas.getNewAba(\"");
		for (Tab tab : tabs) {
			builder.append(tab.getBotaoId());
			builder.append(',');
			builder.append(tab.getIdConteudo());
			builder.append(';');
		}
		builder.append("\")");
		response.renderOnLoadJavascript(builder.toString());
	}
}
