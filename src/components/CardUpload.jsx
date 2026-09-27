import React, { useRef, useEffect } from "react";

function CardUpload({
    chiudi,
    onFileSelect,
    onSave,
    isUploading,
    selectedFile,
    fileVecchio,
    urlFIle,
    seturlFile,
    isInsideFolder
}) {
    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);

    useEffect(() => {
        if (isInsideFolder) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") chiudi();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [chiudi, isInsideFolder]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            onFileSelect(fileVecchio ? files[0] : Array.from(files));
        }
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            onFileSelect(fileVecchio ? files[0] : files);
        }
    };

    const soloFile = Boolean(fileVecchio || isInsideFolder);
    const titleText = fileVecchio ? "Sostituisci File" : "Upload";

    const cardContent = (
        <div 
            role={!isInsideFolder ? "dialog" : undefined}
            aria-modal={!isInsideFolder ? "true" : undefined}
            aria-labelledby="upload-modal-title"
            className={`card w-full bg-[#E2DDD3] text-black ${isInsideFolder ? '' : 'shadow-xl'}`}
            onClick={(e) => e.stopPropagation()} 
        >
            <div className="card-body px-0 py-0 gap-0 flex-none">

                <div className={`w-[70%] mt-16 flex flex-col justify-start ${isInsideFolder ? 'ml-20' : 'mx-auto'}`}>
                    <h2 id="upload-modal-title" className="font-archivio font-semibold text-xl">
                        {titleText}
                    </h2>

                    {fileVecchio && (
                        <p className="text-sm truncate mt-1 text-gray-700">
                            Stai sostituendo: <strong>{fileVecchio.name}</strong>
                        </p>
                    )}
                </div>

                <div
                    className={`bg-[#FDFBF7] mt-8 w-[70%] gap-4 flex flex-wrap border-2 border-dashed border-gray-400 py-10 px-18 justify-center items-center transition-all hover:border-primary hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isInsideFolder ? 'ml-20' : 'mx-auto'}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    role="region"
                    aria-label="Area di rilascio file"
                    tabIndex={0} 
                >
                    <p className="text-base text-medium text-[#000C14] flex-none font-inter">Trascina o</p>

                    <label htmlFor="upload-single-file" className="sr-only">Seleziona uno o più file dal tuo computer</label>
                    <input
                        type="file"
                        id="upload-single-file"
                        className="sr-only"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple={!fileVecchio}
                    />

                    <label htmlFor="upload-folder" className="sr-only">Seleziona una cartella intera dal tuo computer</label>
                    <input
                        type="file"
                        id="upload-folder"
                        className="sr-only"
                        ref={folderInputRef}
                        onChange={handleFileChange}
                        webkitdirectory="true"
                        directory="true"
                    />

                    <div className="flex-none">
                        {soloFile ? (
                            <button 
                                type="button" 
                                className="btn m-1 text-[#99623B] font-semibold bg-[#FFF1B5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Carica
                            </button>
                        ) : (
                            <div className="dropdown dropdown-start">
                                <button 
                                    type="button"
                                    tabIndex={0} 
                                    className="btn m-1 text-[#99623B] font-semibold bg-[#FFF1B5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    Carica
                                </button>
                                <ul tabIndex={0} role="menu" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                    <li role="none">
                                        <button 
                                            type="button" 
                                            role="menuitem"
                                            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            File
                                        </button>
                                    </li>
                                    <li role="none">
                                        <button 
                                            type="button" 
                                            role="menuitem"
                                            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                            onClick={() => folderInputRef.current?.click()}
                                        >
                                            Cartella
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {selectedFile && (
                        <div className="w-full p-4 rounded border border-gray-300 bg-white/50" aria-live="polite">
                            <p className="text-sm font-inter truncate font-medium text-black">
                                {Array.isArray(selectedFile) ? selectedFile.map(f => f.name).join(', ') : selectedFile.name}
                            </p>
                        </div>
                    )}
                </div>

            
                <h2 className={`mt-8 font-semibold font-archivio text-xl ${isInsideFolder ? 'ml-20' : 'ml-28'}`}>
                    Import from url
                </h2>

                <div className="w-[70%] mx-auto mt-4">
                    <label htmlFor="url-input" className="sr-only">
                        Inserisci l'URL del file da importare
                    </label>
                    <input
                        id="url-input"
                        type="url"
                        placeholder="Inserisci URL..."
                        className="input input-bordered w-full bg-white text-black text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        value={urlFIle}
                        onChange={(e) => seturlFile(e.target.value)}
                    />
                </div>

                {!isInsideFolder && (
                    <div className="card-actions justify-end mt-12 mr-8 mb-8">
                        <button 
                            type="button"
                            className="btn btn-ghost text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                            onClick={chiudi}
                        >
                            Annulla
                        </button>
                        <button
                            type="button"
                            className={`btn btn-primary text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37] ${isUploading ? "loading" : ''}`}
                            onClick={onSave}
                            disabled={isUploading || (!selectedFile && !urlFIle)}
                            aria-busy={isUploading}
                        >
                            {isUploading ? "Caricamento..." : "Salva"}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );

    if (isInsideFolder) {
        return cardContent;
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
            onClick={chiudi}
        >
            <div className="w-full max-w-2xl">
                {cardContent}
            </div>
        </div>
    );
}

export default CardUpload;