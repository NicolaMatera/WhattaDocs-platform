import React, { useEffect } from "react";
import CardUpload from "./CardUpload";
import Trash25 from "../assets/Trash25.svg";

function CardGestioneCartella({
    nomeCartella,
    files,
    onElimina,
    chiudi,
    termineRicercaInterna,
    setTermineRicercaInterna,
    onFileSelect,
    onSave,
    isUploading,
    selectedFile,
    urlFIle,
    seturlFile
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") chiudi();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [chiudi]);

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
            onClick={chiudi} 
        >
            <div 
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-folder-title"
                className="card w-full max-w-5xl bg-[#E2DDD3] shadow-2xl text-black"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="modal-folder-title" className="sr-only">
                    Gestione cartella {nomeCartella}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2">

                    <CardUpload
                        chiudi={chiudi}
                        onFileSelect={onFileSelect}
                        onSave={onSave}
                        isUploading={isUploading}
                        selectedFile={selectedFile}
                        urlFIle={urlFIle}
                        seturlFile={seturlFile}
                        isInsideFolder={true}
                    />

                    <div className="pt-28 pr-20">
                        <div className="bg-white border border-transparent rounded-xl max-h-[220px] flex flex-col overflow-hidden">
                            
                            <div className="flex ml-12 w-[50%] mb-3 mt-6 gap-2">
                                <label htmlFor="search-folder-files" className="sr-only">
                                    Cerca file all'interno della cartella
                                </label>
                                <input
                                    id="search-folder-files"
                                    type="search"
                                    placeholder="Cerca..."
                                    className="font-inter bg-white text-sm font-medium text-black border-b border-black pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37] focus-visible:rounded w-full transition-all"
                                    value={termineRicercaInterna}
                                    onChange={(e) => setTermineRicercaInterna(e.target.value)}
                                />
                            </div>

                            <ul 
                                className="flex flex-col overflow-y-auto pl-12 pr-3 mb-4 flex-1 custom-scrollbar"
                                aria-live="polite"
                                aria-label="Elenco dei file nella cartella"
                            >
                                {files.length === 0 ? (
                                    <li className="text-center text-gray-400 mt-10 italic">
                                        {termineRicercaInterna ? "Nessun risultato trovato" : "La cartella è vuota"}
                                    </li>
                                ) : (
                                    files.map((f) => (
                                        <li key={f.id} className="flex justify-between items-center group p-2 hover:bg-gray-100 rounded">
                                            <div className="flex items-center pr-2">
                                                <span className="text-sm font-inter truncate">{f.name}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-sm text-gray-400 hover:text-error shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
                                                onClick={() => onElimina(f)}
                                                aria-label={`Elimina ${f.name}`}
                                                title={`Elimina ${f.name}`}
                                            >
                                                <img src={Trash25} alt="" aria-hidden="true" />
                                            </button>
                                        </li>
                                    ))
                                )}
                            </ul>

                        </div>
                    </div>
                </div>

                <div className="card-actions justify-end my-8 mr-20 gap-4">
                    <button 
                        type="button" 
                        className="btn btn-ghost text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                        onClick={chiudi}
                    >
                        Chiudi
                    </button>
                    
                    <button
                        type="button"
                        className={`btn btn-primary text-sm px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37] ${isUploading ? "loading" : ''}`}
                        onClick={async () => {
                            await onSave();
                        }}
                        disabled={isUploading || (!selectedFile && !urlFIle)}
                        aria-busy={isUploading}
                    >
                        {isUploading ? "Caricamento..." : "Salva file"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default CardGestioneCartella;