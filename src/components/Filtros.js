
import "../css/index.css";
import React, { useState, useEffect } from 'react';
import { NavTabDestaqueTodos } from "./NavTabDestaqueTodos.js";
import { HeaderInfoFundos } from "./HeaderInfoFundos.jsx";
import { AiOutlineMinus } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { Legenda } from "./Legenda.js"
import { DisplayDataDesktop } from "./DisplayDataDesktop.js";
import { Button, Collapse, Tooltip, OverlayTrigger, Popover } from "react-bootstrap"

require("es6-promise").polyfill();
require("isomorphic-fetch");

export const Filtros = () => {

  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [aplicacaoMinima, setAplicacaoMinima] = useState(20000);
  const [perfilRisco, setPerfilRisco] = useState(12);
  const [prazoResgate, setPrazoResgate] = useState(30);
  let [FilteredData, setFilteredData] = useState([]);
  const rendaFixaID = "1";
  const diferenciadaID = "2";
  const varivelID = "3";
  const [openRendaFixa, setOpenRendaFixa] = useState(false);
  const [rendaFixa, setRendaFixa] = useState([]);
  const [checado, setChecado] = useState(true);
  var filtraNomeRendaFixa = [];
  var uniqueNomeRendaFixa = [];
  var filtraNomeGestores = [];
  var checksRendaFixa = [];
  var strRendaFixa = "";
  const [dadosFiltradosRendaFixa, setDadosFiltradosRendaFixa] = useState(false);
  const[iconeDropDown, setIconeDropDown] = useState(false)



  useEffect(() => {
    fetch("https://s3.amazonaws.com/orama-media/json/fund_detail_full.json?limit=1000&offset=0&serializer=fund_detail_full")
      .then((response) => response.json())
      .then((json) => setData(json));
  }, [])



  function changeValueMinimo() {
    var inputAplicacaoMinima = document.querySelector("#aplicacaoMinima");
    var outputAplicacaoMinima = document.querySelector("#valueAplicacaoMinima");


    outputAplicacaoMinima.innerHTML = moneyFormatter(inputAplicacaoMinima.value);
    setAplicacaoMinima(Number(inputAplicacaoMinima.value));

    inputAplicacaoMinima.oninput = function () {
      const valor = this.value;
      outputAplicacaoMinima.innerHTML = valor;
    }
  }

  function changeValuePerfilRisco() {
    var inputPerfilRisco = document.querySelector("#perfilRisco");
    var outputPerfilRisco = document.querySelector("#valuePerfilRisco");

    outputPerfilRisco.innerHTML = inputPerfilRisco.value;
    setPerfilRisco(Number(inputPerfilRisco.value));

    inputPerfilRisco.oninput = function () {
      outputPerfilRisco.innerHTML = this.value;
    }
  }

  function changeValuePrazoResgate() {
    var inputPrazoResgate = document.querySelector("#prazoResgate");
    var outputPrazoResgate = document.querySelector("#valuePrazoResgate");

    outputPrazoResgate.innerHTML = inputPrazoResgate.value;
    setPrazoResgate(Number(inputPrazoResgate.value))


    inputPrazoResgate.oninput = function () {
      outputPrazoResgate.innerHTML = this.value;
    }
  }



  useEffect(() => {

    let filtroRendaFixa, filtroDiferenciada, filtroRendaVariavel = "";
    const checkRendaFixa = true;
    const checkDiferenciada = true;
    const isCheckedRendaVariavel = true;

    if (checkRendaFixa) {
      filtroRendaFixa = rendaFixaID;
    }

    if (checkDiferenciada) {
      filtroDiferenciada = diferenciadaID;

    }
    if (isCheckedRendaVariavel) {
      filtroRendaVariavel = varivelID;
    }

    setFilteredData(
      data.filter(item => {
        return Number(item.operability.minimum_initial_application_amount <= aplicacaoMinima) &&
          Number(item.specification.fund_risk_profile.score_range_order <= perfilRisco) &&
          Number(item.operability.retrieval_quotation_days <= prazoResgate) &&
          JSON.stringify(item.specification.fund_macro_strategy.id).toLowerCase() === filtroRendaFixa &&
          item.simple_name.toLowerCase().includes(q.toLowerCase()) ||


          Number(item.operability.minimum_initial_application_amount <= aplicacaoMinima) &&
          Number(item.specification.fund_risk_profile.score_range_order <= perfilRisco) &&
          Number(item.operability.retrieval_quotation_days <= prazoResgate) &&
          JSON.stringify(item.specification.fund_macro_strategy.id).toLowerCase() === filtroDiferenciada &&
          item.simple_name.toLowerCase().includes(q.toLowerCase()) ||

          Number(item.operability.minimum_initial_application_amount <= aplicacaoMinima) &&
          Number(item.specification.fund_risk_profile.score_range_order <= perfilRisco) &&
          Number(item.operability.retrieval_quotation_days <= prazoResgate) &&
          JSON.stringify(item.specification.fund_macro_strategy.id).toLowerCase() === filtroRendaVariavel &&
          item.simple_name.toLowerCase().includes(q.toLowerCase()) 
      })
    )
  }, [q, data, aplicacaoMinima, perfilRisco, prazoResgate])


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  FilteredData.sort((a, b) => (a.profitabilities.m12 < b.profitabilities.m12) ? 1 : ((b.profitabilities.m12 < a.profitabilities.m12) ? -1 : 0));
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function moneyFormatter(money) {
    const valor = new Intl.NumberFormat('pt-BR',
      { style: 'currency', currency: 'BRL' }
    ).format(money);

    return valor;
  }

  function reformatDate(dateStr) {
    const dArr = dateStr.split("-");
    return dArr[2] + "/" + dArr[1] + "/" + dArr[0].substring(2);
  }

  function dropdown(){
    setOpenRendaFixa(!openRendaFixa)

    setTimeout(()=>{
      setIconeDropDown(!iconeDropDown)
    },200)


  }


  return (
    <>
      <div className="grid-x box-wrap-all-filters">
        <div className="column large-10 box-right-wrap-all">

          <div className="container-busca">
            <div class="box-busca">
              <input type="search" id="buscaFundo" placeholder="Buscar fundo por nome" value={q} onChange={((e) => setQ(e.target.value))} />
              <label for="busca-fundo" className="label-input-search">*Selecione o fundo para saber o horário limite de aplicação.</label>

              <div className="box-filtros">

                <div className="aplicacao-minima item-filtro">
                  <p>Aplicação mínima</p>
                  <input type="range" min="0" max="500000" id="aplicacaoMinima" defaultValue="500000" onChange={changeValueMinimo} step="200"/>
                  <label htmlFor="aplicacao-minima">Até <span id="valueAplicacaoMinima">R$ 500.000,00</span></label>
                </div>

                <div className="perfilRiscoFundo item-filtro perfilRisco">
                  <p className="style">Perfil de risco de fundo</p>
                  <label htmlFor="aplicacao-minima">
                    <ul>
                      <li><span className="item-filter-risco"></span></li>
                      <li><span className="item-filter-risco"></span></li>
                      <li><span className="item-filter-risco"></span></li>
                      <li><span className="item-filter-risco"></span></li>
                      <li><span className="item-filter-risco"></span></li>
                      <li><span className="item-filter-risco"></span></li>
                      <li><span className="item-filter-risco"></span></li>
                      <li><span className="item-filter-risco"></span></li>
                      <li><span className="item-filter-risco"></span></li>
                      <li><span className="item-filter-risco"></span></li>
                      <li><span className="item-filter-risco"></span></li>
                      <li><span className="item-filter-risco"></span></li>
                    </ul>
                  </label>
                  <p className="style-p style-p-menor">menor</p>
                  <input type="range" min="1" max="12" defaultValue="12" id="perfilRisco" onChange={changeValuePerfilRisco} />
                  <p className="style-p style-p-maior">maior</p>
                  <span id="valuePerfilRisco"></span>
                </div>

                <div className="prazoResgate item-filtro">
                  <p>Prazo de resgate</p>
                  <input type="range" min="0" max="270" defaultValue="270" id="prazoResgate" onChange={changeValuePrazoResgate} />
                  <label htmlFor="prazoResgate">Até <span id="valuePrazoResgate">270</span> dias utéis</label>
                </div>

              </div>

              <p className="label-filtros">Horário limite de aplicação: 12:00</p>

            </div>

          </div>

          <NavTabDestaqueTodos FilteredData={FilteredData} />
          <HeaderInfoFundos className="column medium-9" />


          <div classNames='data-mobile'>{(FilteredData.length > 1 ? FilteredData.map((item, index) => {

            const { specification: { fund_type: tipoFundo, fund_class: classeFundo, fund_risk_profile: { score_range_order: corPerfilRiscoFundo } } } = item;
            const { specification: { fund_main_strategy: { name: estrategia_principal } } } = item;
            const { profitabilities: { month: lucroMes, m12, year: lucroAno } } = item;
            const { operability: { minimum_initial_application_amount: aplicacaoMinima, application_quotation_days_str: cotizacaoAplicacao, retrieval_quotation_days: cotizacaoAplicacaoSigla, retrieval_quotation_days_str: cotizacaoResgate,
              retrieval_liquidation_days_str: liquidacaoResgate, application_time_limit: horarioLimiteAplicacao } } = item;
            const { fees: { administration_fee: taxaAdministracao } } = item;
            const {description:{target_audience:icone_qualificado}} = item;


            return (

              <>
                <DisplayDataDesktop simple_name={item.simple_name} corPerfilRisco={Number(corPerfilRiscoFundo)} estrategia_principal={estrategia_principal}
                  tipoFundo={tipoFundo} classeFundo={classeFundo} quota_date={reformatDate(item.quota_date)} m12={(Number(m12 * 100).toFixed(2))}
                  aplicacaoMinima={moneyFormatter(Number(aplicacaoMinima).toFixed())} cotizacaoAplicacaoSigla={cotizacaoAplicacaoSigla} lucroMes={Number(lucroMes * 100).toFixed(2)}
                  lucroAno={Number(lucroAno * 100).toFixed(2)} cotizacaoAplicacao={cotizacaoAplicacao} cotizacaoResgate={cotizacaoResgate} liquidacaoResgate={liquidacaoResgate}
                  taxaAdministracao={taxaAdministracao} cnpj={item.cnpj} icone_qualificado={icone_qualificado} icone_esg={item.esg_seal} close_aplicar={item.is_closed_to_capture}/>

              </>

            );
          }) :
            <div className="box-mensagem-no-item">
              <p>O fundo buscado não está disponível nesta lista. Verifique nas demais abas.</p>
            </div>
          )}</div>



        </div>

        <div className="column large-2 box-left-wrap-all">
          <Legenda/>

          <div className="item-sideBarFiltros">
            <>
              <input type="checkbox" id="input-valor-rendaFixa" className="inside-btn" defaultChecked={true} onChange={() => setDadosFiltradosRendaFixa(!dadosFiltradosRendaFixa)} />
              <Button onClick={() => dropdown()} aria-controls="btn-collapse-renda-fixa" aria-expanded={openRendaFixa} className="bg-light btn-collapse-renda-fixa"><p>Renda Fixa </p> {(iconeDropDown?<AiOutlinePlus className="icone-dropdown" onClick={dropdown}/>:<AiOutlineMinus className="icone-dropdown" onClick={dropdown}/>)}</Button>
              <Collapse in={openRendaFixa}>


                <div id="btn-collapse-renda-fixa">
                  <div class="card card-body bg-white p-0 body-rendaFixa">
                    <ul>
                          <li><input type="checkbox"  className="inside-btn" defaultChecked={true}/><p>Indexado Soberano</p></li>
                          <li><input type="checkbox"  className="inside-btn" defaultChecked={true}/><p>Renda Fixa</p></li>
                          <li className="sub-item"><p>Renda Fixa Crédito Privado</p></li>
                          <li className="sub-item"><p>Crédito Privado High Yield</p></li>
                          <li className="sub-item"><input type="checkbox"  className="inside-btn big-item-input" defaultChecked={true}/><p className="big-item">Renda Fixa Inflação Soberano</p></li>
                          <li className="sub-item"><input type="checkbox"  className="inside-btn big-item-input" defaultChecked={true}/><p className="big-item">Inflação Crédito Privado</p></li>
                    </ul>

                  </div>


                </div>

              </Collapse>
            </>




          </div >



        </div>
      </div>
    </>


  );
}
