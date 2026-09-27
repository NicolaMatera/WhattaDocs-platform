import React, { useState, useEffect } from "react";

function CardRinomina({ chiudi, onSave, fileAttuale, titolo }) {
    const [nuovoNome, setNuovoNome] = useState(fileAttuale?.name || "");

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") chiudi();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [chiudi]);

    const handleSave = (e) => {
        e.preventDefault(); 
        if (titolo.toLowerCase().includes("cartella")) {
            onSave(nuovoNome, fileAttuale?.name);
        } else {
            onSave(nuovoNome);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
            onClick={chiudi}
        >
        
            <div 
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="bg-[#DCD4C8] p-16 rounded-xl shadow-lg w-full max-w-lg text-black"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="modal-title" className="text-xl font-archivio font-semibold mb-4">
                    {titolo}
                </h2>
                
                <p className="text-base text-gray-700 mb-4">
                    Nome attuale: <span className="font-medium">{fileAttuale?.name}</span>
                </p>

             
                <form onSubmit={handleSave}>
                    <label htmlFor="input-nuovo-nome" className="block text-sm font-medium mb-1 sr-only">
                        Nuovo nome
                    </label>
                    <input
                        id="input-nuovo-nome"
                        type="text"
                        placeholder="Inserisci nuovo nome"
                        className="input input-bordered w-full bg-gray-50 text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        value={nuovoNome}
                        onChange={(e) => setNuovoNome(e.target.value)}
                        autoFocus
                    />

                    <div className="flex justify-end gap-4 mt-12">
                        <button 
                            type="button" 
                            className="btn focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none" 
                            onClick={chiudi}
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary focus-visible:ring-2 focus-visible:ring-[#6F4E37] focus-visible:outline-none"
                        >
                            Salva
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CardRinomina;