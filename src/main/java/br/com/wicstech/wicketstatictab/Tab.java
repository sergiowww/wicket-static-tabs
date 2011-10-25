package br.com.wicstech.wicketstatictab;

import java.io.Serializable;

/**
 * Nova aba.
 * @author Sergio
 *
 */
public class Tab implements Serializable{
	private static final long serialVersionUID = -6112180173004026694L;
	private String idConteudo,
	tabName;
	

	public Tab(String idConteudo, String tabName) {
		super();
		this.idConteudo = idConteudo;
		this.tabName = tabName;
	}

	/**
	 * @return the idConteudo
	 */
	public String getIdConteudo() {
		return idConteudo;
	}

	/**
	 * @param idConteudo the idConteudo to set
	 */
	public void setIdConteudo(String idConteudo) {
		this.idConteudo = idConteudo;
	}

	/**
	 * @return the tabName
	 */
	public String getTabName() {
		return tabName;
	}

	/**
	 * @param tabName the tabName to set
	 */
	public void setTabName(String tabName) {
		this.tabName = tabName;
	}
	
	/**
	 * Identificador do botão.
	 * @return
	 */
	public String getBotaoId(){
		return "botao"+getIdConteudo();
	}
}
