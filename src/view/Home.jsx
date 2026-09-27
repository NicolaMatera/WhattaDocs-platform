import SchermataHover from "../components/SchermataHover";
import CardRinomina from "../components/CardRinomina";
import CardUpload from "../components/CardUpload";
import CardGestioneCartella from "../components/CardGestioneCartella";
import { useHomeViewModel } from "../../viewmodel/useHomeViewModel";
import { useState, useEffect, useRef } from "react";

import Option from "../assets/option.svg";
import Trash from "../assets/Trash.svg";
import Filtra from "../assets/Filtra.svg";

import 'cally';

function Home() {
    const {
        tipoCard, tipoRinomina, caricamento, fileSelezionato,
        listaFile, fileDaRinominare, fileDaSostituire,
        nomeCercato, urlFIle, filtri, cartellaAperta,
        fileDellaCartella, eliminaFileDaCartella, cartellaTarget,
        setCartellaTarget, termineRicercaInterna, mostraFiltri,
        recuperaFile, aggiornaFiltri, resetFiltri, setFiltri,
        seturlFile, setNomeCercato, apriUpload, setMostraFiltri,
        apriRinominaFile, apriRinominaCartella, chiudiCard,
        selezionaFile, uploadSuSupabase, confermaRinomina,
        apriModificaFile, gestisciSalvataggio,
        apriGestoreCartella, setTipoCard, setTermineRicercaInterna, eliminaElemento,
        isCartella, handleToggleFiltri
    } = useHomeViewModel();

    const filtroRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (mostraFiltri && filtroRef.current && !filtroRef.current.contains(event.target)) {
                setMostraFiltri(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [mostraFiltri, setMostraFiltri]);

    return (
        <main className="relative bg-[#EBE3D799] pb-12 flex-1">
            <h1 className="sr-only">Dashboard e Gestione File</h1>

            {tipoCard === 'rinomina' && (
                <CardRinomina
                    chiudi={chiudiCard}
                    onSave={confermaRinomina}
                    fileAttuale={fileDaRinominare}
                    titolo={tipoRinomina === 'file' ? "Rinomina file" : "Rinomina cartella"}
                />
            )}

            {tipoCard === 'upload' && (
                <CardUpload
                    chiudi={chiudiCard}
                    onFileSelect={selezionaFile}
                    onSave={gestisciSalvataggio}
                    isUploading={caricamento}
                    selectedFile={fileSelezionato}
                    fileVecchio={fileDaSostituire}
                    urlFIle={urlFIle}
                    seturlFile={seturlFile}
                />
            )}

            {tipoCard === 'gestione_cartella' && (
                <CardGestioneCartella
                    nomeCartella={cartellaAperta}
                    files={fileDellaCartella}
                    onElimina={eliminaFileDaCartella}
                    termineRicercaInterna={termineRicercaInterna}
                    setTermineRicercaInterna={setTermineRicercaInterna}
                    chiudi={chiudiCard}
                    onFileSelect={selezionaFile}
                    onSave={gestisciSalvataggio}
                    isUploading={caricamento}
                    selectedFile={fileSelezionato}
                    urlFIle={urlFIle}
                    seturlFile={seturlFile}
                />
            )}

            <div className="flex justify-center">
                <button
                    type="button"
                    className="font-archivio btn h-auto min-h-0 mt-24 font-bold text-xl py-4 px-8 bg-[#EED186] rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37]"
                    onClick={apriUpload}
                >
                    Upload
                </button>
            </div>

            <section aria-labelledby="filters-heading" className="w-[60%] mx-auto mt-28 flex justify-end items-center relative">
                <h2 id="filters-heading" className="sr-only">Ricerca e Filtri</h2>

                <div ref={filtroRef} className="flex items-center gap-4 relative">

                    {mostraFiltri && (
                        <div 
                            role="region" 
                            aria-label="Pannello filtri avanzati" 
                            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 flex items-center gap-3 bg-[#E1DBD3] p-2.5 px-4 rounded-xl shadow-lg border border-[#C2BAB0] z-30 shrink-0"
                        >
                            <div className="flex bg-[#F9F8F6] rounded-lg p-1 text-xs font-archivio font-medium shrink-0" role="group" aria-label="Filtra per tipo di elemento">
                                <button
                                    type="button"
                                    onClick={() => aggiornaFiltri({ tipoEntita: 'file' })}
                                    aria-pressed={!isCartella}
                                    className={`px-3 py-1 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37] ${
                                        !isCartella
                                            ? 'bg-[#6F4E37] text-white'
                                            : 'text-gray-600 hover:text-black'
                                    }`}
                                >
                                    File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => aggiornaFiltri({ tipoEntita: 'cartella', tipoFile: 'tutti' })}
                                    aria-pressed={isCartella}
                                    className={`px-3 py-1 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37] ${
                                        isCartella
                                            ? 'bg-[#6F4E37] text-white'
                                            : 'text-gray-600 hover:text-black'
                                    }`}
                                >
                                    Cartelle
                                </button>
                            </div>

                            <label htmlFor="filter-file-type" className="sr-only">Filtra per tipo di file</label>
                            <select
                                id="filter-file-type"
                                disabled={isCartella}
                                className={`h-8 text-xs font-inter font-medium rounded-lg px-2 border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37] shrink-0 transition-all ${
                                    isCartella
                                        ? 'bg-gray-200/70 text-gray-400 cursor-not-allowed opacity-60'
                                        : 'bg-[#F9F8F6] text-black cursor-pointer'
                                }`}
                                value={filtri.tipoFile || 'tutti'}
                                onChange={(e) => aggiornaFiltri({ tipoFile: e.target.value })}
                            >
                                <option value="tutti">Tutti i tipi</option>
                                <option value="image">Immagini</option>
                                <option value="pdf">PDF</option>
                                <option value="video">Video</option>
                                <option value="text">Testo</option>
                            </select>

                            <label htmlFor="filter-file-date" className="sr-only">Filtra per data di caricamento</label>
                            <input
                                id="filter-file-date"
                                type="date"
                                className="h-8 bg-[#F9F8F6] text-black text-xs font-archivio rounded-lg px-2 border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37] cursor-pointer shrink-0"
                                value={filtri.dataCaricamento || ''}
                                onChange={(e) => aggiornaFiltri({ dataCaricamento: e.target.value })}
                            />

                            <button
                                type="button"
                                onClick={resetFiltri}
                                className="text-xs font-archivio font-bold text-[#6F4E37] hover:text-black px-2 py-1 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37] focus-visible:rounded"
                                title="Reset filtri"
                                aria-label="Resetta tutti i filtri"
                            >
                                Reset
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleToggleFiltri}
                        className={`btn btn-ghost btn-circle btn-sm hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37] ${mostraFiltri ? 'bg-[#D6CFC7]' : ''}`}
                        title="Filtri avanzati"
                        aria-label="Mostra filtri avanzati"
                        aria-expanded={mostraFiltri}
                    >
                        <img src={Filtra} alt="" aria-hidden="true" className="w-5 h-5 object-contain" />
                    </button>

                    <label htmlFor="search-home-files" className="sr-only">Cerca file o cartelle</label>
                    <input
                        id="search-home-files"
                        type="search"
                        placeholder="Cerca..."
                        className="font-inter w-[60%] text-sm font-medium text-[#000C14] border-b-2 border-[#000C14] pb-1 bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37] focus-visible:rounded"
                        value={nomeCercato}
                        onChange={(e) => setNomeCercato(e.target.value)}
                    />

                </div>

            </section>

            <section 
                className="mt-24 w-[60%] mx-auto max-h-[40vh] overflow-y-auto custom-scrollbar pr-2 pt-2"
                aria-labelledby="file-list-heading"
            >
                <h2 id="file-list-heading" className="sr-only">Elenco dei file caricati</h2>
                
                {listaFile && listaFile.map((file, index) => {
                    const nomeProprietario = "Proprietario";
                    const dataFormattata = file.created_at ? new Date(file.created_at).toLocaleDateString('it-IT') : "00/00/0000";

                    const isUltimo = index === listaFile.length - 1;
                    const classePosizioneTooltip = isUltimo ? "bottom-full mb-1" : "top-full mt-1";

                    return (
                        <div key={file.id || index} className="w-full p-4 bg-white shadow rounded-lg flex justify-between text-black shrink-0 mt-8 first:mt-0">

                            <div className="grid grid-cols-8 items-center gap-8 min-w-0 flex-1 text-black font-inter text-sm font-bold">

                                <div className="col-span-2 flex items-center gap-4 min-w-0">
                                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                        <img src={file.icona} alt="" aria-hidden="true" className="w-full h-full object-contain" />
                                    </div>

                                    <div className="min-w-0 flex-1 relative group cursor-pointer">
                                        <span className="truncate block text-black">
                                            {file.name}
                                        </span>
                                        <div aria-hidden="true" className={`absolute left-0 ${classePosizioneTooltip} hidden group-hover:block z-50 bg-[#000C14] text-white text-xs font-normal py-1.5 px-3 rounded-md shadow-xl whitespace-nowrap pointer-events-none`}>
                                            {file.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-1 min-w-0 relative group cursor-pointer">
                                    <span className="truncate block text-gray-700 font-medium">
                                        {nomeProprietario}
                                    </span>
                                    <div aria-hidden="true" className={`absolute left-0 ${classePosizioneTooltip} hidden group-hover:block z-50 bg-[#000C14] text-white text-xs font-normal py-1.5 px-3 rounded-md shadow-xl whitespace-nowrap pointer-events-none`}>
                                        {nomeProprietario}
                                    </div>
                                </div>

                                <div className="col-span-1 min-w-0 relative group cursor-pointer">
                                    <span className="truncate block text-gray-700 font-medium">
                                        {dataFormattata}
                                    </span>
                                    <div aria-hidden="true" className={`absolute left-0 ${classePosizioneTooltip} hidden group-hover:block z-50 bg-[#000C14] text-white text-xs font-normal py-1.5 px-3 rounded-md shadow-xl whitespace-nowrap pointer-events-none`}>
                                        {dataFormattata}
                                    </div>
                                </div>

                                <div className="col-span-1 min-w-0 relative group cursor-pointer">
                                    <span className="truncate block">
                                        {file.tipoEsteso}
                                    </span>
                                    <div aria-hidden="true" className={`absolute left-0 ${classePosizioneTooltip} hidden group-hover:block z-50 bg-[#000C14] text-white text-xs font-normal py-1.5 px-3 rounded-md shadow-xl whitespace-nowrap pointer-events-none`}>
                                        {file.tipoEsteso}
                                    </div>
                                </div>

                            </div>

                            <div className="flex items-center shrink-0">

                                <button 
                                    type="button"
                                    className="font-inter btn mr-12 px-4 py-1 font-extrabold text-base bg-[#FFF1B5] text-[#99623B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37]"
                                    aria-label={`Avvia elaborazione per ${file.name}`}
                                >
                                    Start
                                </button>

                                <button
                                    type="button"
                                    className="mr-8 btn btn-ghost btn-circle btn-sm text-error hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37]"
                                    title={`Elimina ${file.name}`}
                                    aria-label={`Elimina ${file.name}`}
                                    onClick={() => eliminaElemento(file)}
                                >
                                    <img src={Trash} alt="" aria-hidden="true" />
                                </button>

                                <details 
                                    className={`mr-8 dropdown dropdown-end ${isUltimo ? 'dropdown-top' : ''} text-black font-inter`}
                                    onBlur={(e) => {
                                        if (!e.currentTarget.contains(e.relatedTarget)) {
                                            e.currentTarget.removeAttribute("open");
                                        }
                                    }}
                                >
                                    <summary
                                        className="btn btn-ghost btn-circle btn-sm list-none hover:bg-base-200 flex items-center justify-center cursor-pointer [::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37]"
                                        aria-label={`Opzioni per ${file.name}`}
                                        aria-haspopup="menu"
                                    >
                                        <img src={Option} alt="" aria-hidden="true" className="w-5 h-5 object-contain" />
                                    </summary>

                                    <ul role="menu" className="dropdown-content menu bg-white rounded-box z-50 w-40 p-2 shadow-lg border border-base-200">
                                        <li role="none">
                                            <button
                                                type="button"
                                                role="menuitem"
                                                className="w-full text-left text-xs py-2 px-4 hover:bg-gray-100 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37]"
                                                onClick={(e) => {
                                                    e.currentTarget.closest("details")?.removeAttribute("open");
                                                    apriRinominaFile(file);
                                                }}
                                            >
                                                Rinomina
                                            </button>
                                        </li>

                                        {file.is_folder && (
                                            <li role="none">
                                                <button
                                                    type="button"
                                                    role="menuitem"
                                                    className="w-full text-left text-xs py-2 px-4 hover:bg-gray-100 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37]"
                                                    onClick={(e) => {
                                                        e.currentTarget.closest("details")?.removeAttribute("open");
                                                        apriGestoreCartella(file.name);
                                                    }}
                                                >
                                                    Gestisci
                                                </button>
                                            </li>
                                        )}

                                        {!file.is_folder && (
                                            <li role="none">
                                                <button
                                                    type="button"
                                                    role="menuitem"
                                                    className="w-full text-left text-xs py-2 px-4 hover:bg-gray-100 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37]"
                                                    onClick={(e) => {
                                                        e.currentTarget.closest("details")?.removeAttribute("open");
                                                        apriModificaFile(file);
                                                    }}
                                                >
                                                    Modifica
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </details>

                            </div>

                        </div>
                    );
                })}
            </section>
        </main>
    );
}

export default Home;