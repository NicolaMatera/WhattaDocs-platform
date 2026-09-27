import React, { useEffect, useRef } from 'react';

function FiltroAvanzato({ filtriAttuali, onCambiaFiltro, chiudi, onReset }) {
    const cardRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                if (chiudi) chiudi();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [chiudi]);

    const isCartella = filtriAttuali.tipoEntita === 'cartella';

    return (
        <div ref={cardRef} className="w-full bg-[#E1DBD3] rounded-xl shadow-lg text-black overflow-hidden">

            <div className="flex w-full border-b border-[#C2BAB0]">
                <button
                    type="button"
                    onClick={() => onCambiaFiltro({ tipoEntita: 'file' })}
                    className={`font-archivio text-2xl font-light flex-1 py-6 text-center ${
                        !isCartella
                            ? 'bg-[#D6CFC7] border-r border-[#C2BAB0]'
                            : 'bg-[#F9F8F6] text-gray-500 hover:bg-[#F1EFEA]'
                    }`}
                >
                    File
                </button>

                <button
                    type="button"
                    onClick={() => onCambiaFiltro({ tipoEntita: 'cartella', tipoFile: 'tutti' })}
                    className={`font-archivio text-2xl font-light flex-1 py-6 text-center ${
                        isCartella
                            ? 'bg-[#D6CFC7]'
                            : 'bg-[#F9F8F6] text-gray-500 hover:bg-[#F1EFEA]'
                    }`}
                >
                    Cartelle
                </button>
            </div>

            <div className="px-12 pt-8 pb-6 flex flex-col gap-8">

                <div className="flex flex-col gap-2">
                    <label className={`font-archivio font-medium text-xl transition-colors ${
                        isCartella ? 'text-gray-400' : 'text-black'
                    }`}>
                        Tipo file
                    </label>
                    <select
                        disabled={isCartella}
                        className={`w-[45%] select select-ghost border-none rounded-lg text-base focus:outline-none transition-all ${
                            isCartella
                                ? 'bg-gray-200/60 text-gray-400 cursor-not-allowed'
                                : 'bg-[#F9F8F6] text-black cursor-pointer'
                        }`}
                        value={filtriAttuali.tipoFile || 'tutti'}
                        onChange={(e) => onCambiaFiltro({ tipoFile: e.target.value })}
                    >
                        <option value="tutti">Tutti i formati</option>
                        <option value="image">Immagini</option>
                        <option value="pdf">PDF</option>
                        <option value="video">Video</option>
                        <option value="text">Testo</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-archivio font-medium text-xl text-black">Data range</label>
                    <input
                        type="date"
                        className="w-[45%] input input-ghost bg-[#F9F8F6] border-none rounded-lg px-4 text-black text-base font-archivio focus:outline-none"
                        value={filtriAttuali.dataCaricamento || ''}
                        onChange={(e) => onCambiaFiltro({ dataCaricamento: e.target.value })}
                    />
                </div>

                <div className="flex justify-end items-center gap-4 mt-2">
                    <button
                        type="button"
                        onClick={onReset}
                        className="font-archivio font-medium text-sm text-[#6F4E37] hover:text-black px-4 py-2 rounded-lg border border-[#C2BAB0] hover:bg-[#D6CFC7] transition-colors cursor-pointer"
                    >
                        Reset
                    </button>
                </div>

            </div>
        </div>
    );
}

export default FiltroAvanzato;