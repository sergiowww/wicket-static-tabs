/** 
 * ABAS
 *
 * @author DEINF.SDANTAS 
 *
 * <b>Instruções de uso</b>
 *	
 *	<code>
 *	 	<a href="#" id="tabRegistroAncora">
 *			Aba 1
 *		</a>
 *		<a href="#" id="tabCidadaoAncora">
 *			Aba 2
 *		</a>
 *		<div id="tabCriteriosPesquisa">
 *			Conteúdo da tab1
 *		</div>
 *		<div id="tabResultadoPesquisa">
 *			Conteúdo da tab2
 *		</div>
 * 
 * 		<script type="text/javascript">
 * 			Event.observe(window, "load", function(){
 * 				//lembrando que a ordem importa, tem que ser primeir o id do botão que vai ativar a tab depois o conteúdo dela
 *				FactoryAbas.getNewAba("tabRegistroAncora,tabRegistro;tabCidadaoAncora,tabCidadao"); 
 * 			});
 * 		</script>
 * 
 *	</code>
 */

var Aba = Class.create();

Aba.prototype = {
	/**
	 * estilo para o botão de aba ativa
	 * @type String
	 */
	styleClassAtivo: "mtabi",
	
	/**
	 * estilo para o botão de aba inativa
	 * @type String
	 */
	styleClassInativo: "mtaba",
	
	/**
	 * pares de abas (botão e div de conteúdo da aba)
	 * @type Hash
	 */
	pares: null,
	
	/**
	 * ao inicializar a primeira aba passada é a ativa
	 * @type HTMLAnchorElement
	 */
	parAtivo: null,
	
	/**
	 * @constructor
	 * 
	 * deverá ser passado os pares de botão/conteúdo como segue o exemplo
	 * botao1,conteudo1;botao2,conteudo2;botao3,conteudo3
	 * @param {String} conjuntos  
	 */
	initialize: function(conjuntos){
		this.pares = new Hash();
		var pares = conjuntos.split(";");
		this.parAtivo = null;
		for(var index = 0; index < pares.length; index++){
			var items = pares[index];
			if(!items.blank()){
				items = items.split(",");
				this.addPar(items[0], items[1]);
			}
		}
	},
	/**
	 * adicionar um par de botão/conteudo
	 * 
	 * @param {HTMLAnchorElement} elemento
	 * @param {HTMLDivElement} conteudo
	 * @return
	 */
	addPar: function(elemento, conteudo){
		this.pares.set(elemento, conteudo);
		this.configurarPar(elemento, conteudo);
	},
	/**
	 * Configura o par de conteúdo botão
	 * @param {String} elemento
	 * @param {String} conteudo
	 * @return
	 */
	configurarPar: function(elemento, conteudo){
		if(this.parAtivo == null){
			$(elemento).className = this.styleClassAtivo;
			$(conteudo).show();
			this.parAtivo = elemento;
		}else{
			$(elemento).className = this.styleClassInativo;
			$(conteudo).hide();
		}
		Event.observe(elemento, "click", this.setAtivo.bindAsEventListener(this, elemento));
	},
	/**
	 * Reconfigurar eventos nos elementos da aba
	 * @return
	 */
	reconfigurarEventos: function(){
		this.parAtivo = null;
		this.pares.each((function(pair){
			this.configurarPar(pair.key, pair.value);
		}).bind(this));
	},
	/**
	 * define quem está ativo a partir do clique e inativa as outras abas
	 * @param {Event} e
	 * @return
	 */
	setAtivo: function(e){
		var elemento = $A(arguments)[1];
		this.pares.each((function(pair){
			var divArea=$(pair.value);
			var botaoChave=$(pair.key);
			if(divArea != null && botaoChave != null){
				if(pair.key != elemento){
					botaoChave.className = this.styleClassInativo;
					divArea.hide();
				}else{
					botaoChave.className = this.styleClassAtivo;
					divArea.show();
					var firstDescendant=divArea.firstDescendant();
					this.focusPrimeiroElementoTextArea(firstDescendant);
				}
			}				
		}).bind(this));
	},
	/**
	 * Focalizar o primeiro elemento da divArea se o primeiro elemento 
	 * for um textarea
	 * @param {HTMLElement} firstDescendant
	 */
	focusPrimeiroElementoTextArea: function(firstDescendant){
		if(firstDescendant != null){
			if(firstDescendant.nodeName.toLowerCase() == "textarea"){
				firstDescendant.focus();
			}
			if(firstDescendant.nodeName.toLowerCase() == "form"){
				this.focusPrimeiroElementoTextArea(firstDescendant.firstDescendant());
			}
		}
	},
	/**
	 * mostra a aba que contém o elemento passado
	 * @param {HTMLElement} elemento
	 * @return <code>true</code> se conseguiu ativar a aba <code>false</code> se não
	 * @type Boolean
	 */
	ativaTabPorElemento: function(elemento){
		if($(elemento) == null){
			return false;
		}
		if(Object.isArray(elemento)){
			elemento = elemento[0];
		}
		var resultado = false;
		this.pares.each((function(iterator){
			if($(elemento).descendantOf(iterator.value)){
				resultado = true;
				this.setAtivo(null, iterator.key);
				throw $break;
			}
		}).bind(this));
		return resultado;
	},
	/**
	 * ativa a tab pelo id do elemento botão
	 * @param {String} idElemento
	 * @return <code>true</code> se encontrou a aba <code>false</code> se não 
	 * @type Boolean
	 */
	ativaTabPorId: function(idElemento){
		if(this.pares.get(idElemento) != null){
			this.setAtivo(null, idElemento);
			return true;
		}
		return false;
	}
};
/**
 * Fachada para criação de abas
 */
var FactoryAbas = Class.create();
FactoryAbas = {
	/**
	 * todas as abas ativas
	 * @type Hash
	 */
	abasAtivas:  new Hash(),
	/**
	 * @param {String} conjuntos
	 * @return o objeto Aba que representa o conjunto de abas que foi configurado
	 * @type Aba
	 */
	getNewAba: function(conjuntos){
		var aba = this.abasAtivas.get(conjuntos);
		if(aba == null){
			aba = new Aba(conjuntos);
			this.abasAtivas.set(conjuntos, aba);
		}else{
			aba.reconfigurarEventos();
		}
		return aba;
	},
	/**
	 * procura o elemento passado em todos os conjuntos de abas e ativa a aba onde ele
	 * foi encontrado
	 * @param {HTMLElement} elemento
	 */
	ativaAbaPorElemento: function(elemento){
		if(typeof elemento == "string"){
			var el = $(elemento);
			if(el == null){
				elemento = document.getElementsByName(elemento).item(0);
			}
		}
		if(elemento == null){
			return;
		}
		this.abasAtivas.values().each(function(aba){
			if(aba.ativaTabPorElemento(elemento)){
				throw $break;
			}
		});
	},
	/**
	 * Ativa a aba pelo id do botão da mesma
	 * @param {String} idBotaoAba
	 */
	ativaAbaPorId: function(idBotaoAba){
		this.abasAtivas.values().each(function(aba){
			if(aba.ativaTabPorId(idBotaoAba)){
				throw $break;
			}
		});
	}
};