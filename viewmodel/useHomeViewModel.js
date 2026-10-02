import { supabase } from "../src/supabaseClient";
import { useState, useEffect } from "react";

import IconaCartella from "../src/assets/Folder.svg";
import IconaFileGenerico from "../src/assets/File.svg";

const FILTRI_INIZIALI = {
    tipoEntita: 'tutti',
    dataCaricamento: '',
    tipoFile: 'tutti'
};

export function useHomeViewModel() {

    const [isInizializzato, setIsInizializzato] = useState(false);
    const [tipoCard, setTipoCard] = useState(null);
    const [tipoRinomina, setTipoRinomina] = useState(null);

    const [fileSelezionato, setFileSelezionato] = useState(null);
    const [caricamento, setCaricamento] = useState(false); 

    const [listaFile, setListaFile] = useState([]);

    const [fileDaRinominare, setFileDaRinominare] = useState(null);
    const [fileDaSostituire, setFileDaSostituire] = useState(null);

    const [urlFIle, seturlFile] = useState("");
    const [nomeCercato, setNomeCercato] = useState("");
    const [termineRicercaInterna, setTermineRicercaInterna] = useState("");

    const [filtri, setFiltri] = useState(FILTRI_INIZIALI);

    const [cartellaAperta, setCartellaAperta] = useState(null);
    const [fileDellaCartella, setFileDellaCartella] = useState([]);
    const [cartellaTarget, setCartellaTarget] = useState(null);

    const [mostraFiltri, setMostraFiltri] = useState(false);

    // --- NUOVA LOGICA: SVUOTA DATABASE ALL'AVVIO ---
    const svuotaAmbienteIniziale = async () => {
        try {
            setCaricamento(true);
            
            // 1. Recupera tutti i record esistenti
            const { data: tuttiIFile, error: fetchError } = await supabase.from('files').select('*');
            if (fetchError) throw fetchError;

            if (tuttiIFile && tuttiIFile.length > 0) {
                // 2. Estrai i percorsi fisici dallo Storage
                const percorsiStorage = tuttiIFile
                    .filter(f => f.storage_path)
                    .map(f => f.storage_path);

                // 3. Elimina fisicamente i file dal bucket
                if (percorsiStorage.length > 0) {
                    await supabase.storage.from('documenti').remove(percorsiStorage);
                }

                const ids = tuttiIFile.map(f => f.id);
                const { error: deleteError } = await supabase.from('files').delete().in('id', ids);
                if (deleteError) throw deleteError;
            }

            setListaFile([]); // Assicura che la UI sia vuota
        } catch (error) {
            console.error("Errore durante lo svuotamento iniziale:", error);
        } finally {
            setCaricamento(false);
            setIsInizializzato(true); // Permette il normale funzionamento dell'app
        }
    };

    // Esegue il wipe al primo render del componente
    useEffect(() => {
        svuotaAmbienteIniziale();
    }, []);
    // -----------------------------------------------

    const calcolaEtichettaTipo = (file) => {
        if (file.is_folder) return "Cartella";

        const mimeType = file.type?.toLowerCase() || '';
        const nome = file.name?.toLowerCase() || '';

        if (mimeType.includes('plain') || nome.endsWith('.txt')) return "txt";
        if (mimeType.includes('opendocument.text') || nome.endsWith('.odt')) return "odt";
        if (mimeType.includes('pdf') || nome.endsWith('.pdf')) return "pdf";
        if (mimeType.includes('png') || nome.endsWith('.png')) return "png";
        if (mimeType.includes('jpeg') || nome.endsWith('.jpg') || nome.endsWith('.jpeg')) return "jpg";

        if (nome.includes('.')) {
            const ext = nome.split('.').pop();
            if (ext.length <= 4) return ext;
        }

        if (mimeType.includes('/')) {
            return mimeType.split('/')[1];
        }

        return "file";
    };

    const recuperaFile = async (termineRicerca = "", filtriDaApplicare = filtri) => {
        try {
            let query = supabase
                .from('files')
                .select('*')
                .order('created_at', { ascending: false });

            if (termineRicerca) {
                query = query.or(`name.ilike.%${termineRicerca}%,folder_path.ilike.%${termineRicerca}%`);
            }

            if (filtriDaApplicare.tipoEntita === 'file') {
                query = query.is('folder_path', null);
                if (filtriDaApplicare.tipoFile !== 'tutti') {
                    query = query.ilike('type', `%${filtriDaApplicare.tipoFile}%`);
                }
            } else if (filtriDaApplicare.tipoEntita === 'cartella') {
                query = query.not('folder_path', 'is', null);
            }

            if (filtriDaApplicare.dataCaricamento) {
                query = query.gte('created_at', filtriDaApplicare.dataCaricamento);
            }

            const { data, error } = await query;
            if (error) throw error;

            const visualizzazione = [];
            const cartelleGiaInserite = new Set();

            data.forEach(file => {
                if (file.folder_path) {
                    if (!cartelleGiaInserite.has(file.folder_path)) {
                        const cartellaObj = {
                            id: `folder_${file.folder_path}`,
                            name: file.folder_path,
                            is_folder: true,
                            created_at: file.created_at,
                            icona: IconaCartella
                        };
                        visualizzazione.push({
                            ...cartellaObj,
                            tipoEsteso: calcolaEtichettaTipo(cartellaObj)
                        });
                        cartelleGiaInserite.add(file.folder_path);
                    }
                } else {
                    const fileObj = {
                        ...file,
                        is_folder: false,
                        icona: IconaFileGenerico
                    };
                    visualizzazione.push({
                        ...fileObj,
                        tipoEsteso: calcolaEtichettaTipo(fileObj)
                    });
                }
            });

            setListaFile(visualizzazione);
        } catch (error) {
            console.error("Errore query recuperaFile:", error.message);
        }
    };

    const resetFiltri = async () => {
        setNomeCercato("");
        setFiltri(FILTRI_INIZIALI);
        await recuperaFile("", FILTRI_INIZIALI);
        setMostraFiltri(false);
    };

    useEffect(() => {
        if (isInizializzato) {
            recuperaFile(nomeCercato, filtri);
        }
    }, [nomeCercato, filtri, isInizializzato]);

    useEffect(() => {
        filtraFileCartella();
    }, [termineRicercaInterna, cartellaAperta]);

    const apriUpload = () => {
        setCartellaTarget(null);
        setTipoCard('upload');
    };

    const apriRinominaFile = (file) => {
        setTipoCard('rinomina');
        setTipoRinomina(file.is_folder ? 'cartella' : 'file');
        setFileDaRinominare(file);
    };

    const apriModificaFile = (file) => {
        setFileDaSostituire(file);
        setTipoCard('upload');
    };

    const apriRinominaCartella = () => {
        setTipoCard('rinomina');
        setTipoRinomina('cartella');
    };

    const chiudiCard = () => {
        setTipoCard(null);
        setTipoRinomina(null);
        setFileSelezionato(null);
        setFileDaSostituire(null);
        setCartellaTarget(null);
        setTermineRicercaInterna("");
        setCaricamento(false);
    };

    const selezionaFile = (file) => {
        if (file) setFileSelezionato(file);
    };

    const uploadSuSupabase = async () => {
        setCaricamento(true);

        let listaFileDaCaricare = [];

        if (Array.isArray(fileSelezionato)) {
            listaFileDaCaricare = [...fileSelezionato];
        } else if (fileSelezionato) {
            listaFileDaCaricare = [fileSelezionato];
        }

        try {
            if (urlFIle && listaFileDaCaricare.length === 0) {
                const { data, error: funcError } = await supabase.functions.invoke('proxy-download', {
                    body: { url: urlFIle }
                });
                if (funcError) throw funcError;

                const nomeFile = urlFIle.split('/').pop().split('?')[0] || "file_web";
                const fileDallUrl = new File([data], nomeFile, { type: data.type });
                listaFileDaCaricare = [fileDallUrl];
            }

            if (listaFileDaCaricare.length === 0) throw new Error("Nessun contenuto da caricare.");

            for (const file of listaFileDaCaricare) {
                const percorsoOriginale = file.webkitRelativePath || file.name;
                const nomeUnivoco = `${Date.now()}_${percorsoOriginale.replace(/\//g, '_')}`;

                let folderPathCalcolato = null;
                if (cartellaTarget) {
                    folderPathCalcolato = cartellaTarget;
                } else if (file.webkitRelativePath && file.webkitRelativePath.includes('/')) {
                    folderPathCalcolato = file.webkitRelativePath.split('/')[0];
                }

                const { error: storageError } = await supabase.storage
                    .from('documenti')
                    .upload(nomeUnivoco, file);

                if (storageError) throw storageError;

                const { error: dbError } = await supabase
                    .from('files')
                    .insert([{
                        name: file.name,
                        storage_path: nomeUnivoco,
                        size: file.size,
                        type: file.type,
                        folder_path: folderPathCalcolato
                    }]);

                if (dbError) throw dbError;
            }

            setFileSelezionato(null);
            seturlFile("");

            if (cartellaTarget) {
                const { data } = await supabase
                    .from('files')
                    .select('*')
                    .eq('folder_path', cartellaTarget)
                    .order('created_at', { ascending: false });
                if (data) setFileDellaCartella(data);
                await recuperaFile(); 
            } else {
                setFiltri(FILTRI_INIZIALI);
                await recuperaFile("", FILTRI_INIZIALI);
                chiudiCard();
            }

        } catch (error) {
            console.error("Errore upload:", error);
            alert("Errore caricamento: " + error.message);
        } finally {
            setCaricamento(false);
        }
    };

    const confermaRinomina = async (nuovoNome, vecchioPath) => {
        if (!fileDaRinominare || !nuovoNome) return;
        setCaricamento(true);

        try {
            if (vecchioPath) {
                const { error } = await supabase
                    .from('files')
                    .update({ folder_path: nuovoNome })
                    .eq('folder_path', vecchioPath);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('files')
                    .update({ name: nuovoNome })
                    .eq('id', fileDaRinominare.id);

                if (error) throw error;
            }

            setFileDaRinominare(null);
            await recuperaFile();
            chiudiCard();

        } catch (error) {
            alert("Errore durante la rinomina: " + error.message);
        } finally {
            setCaricamento(false);
        }
    };

    const gestisciSalvataggio = async () => {
        if (fileDaSostituire) {
            await sostituisciFileSuSupabase();
        } else {
            await uploadSuSupabase();
        }
    };

    const sostituisciFileSuSupabase = async () => {
        if (!fileDaSostituire) return;

        setCaricamento(true);
        let fileEffettivo = fileSelezionato;

        try {
            if (urlFIle && !fileSelezionato) {
                const { data, error: functionError } = await supabase.functions.invoke('proxy-download', {
                    body: { url: urlFIle }
                });

                if (functionError) throw new Error("Errore recupero URL: " + functionError.message);

                const blob = data;
                const nomeFile = urlFIle.split('/').pop().split('?')[0] || "file_sostituto";
                fileEffettivo = new File([blob], nomeFile, { type: blob.type });
            }

            if (!fileEffettivo) {
                throw new Error("Seleziona un file o inserisci un URL valido.");
            }

            const nuovoPath = `${Date.now()}_${fileEffettivo.name}`;

            const { error: storageError } = await supabase.storage
                .from('documenti')
                .upload(nuovoPath, fileEffettivo);

            if (storageError) throw storageError;

            const { error: dbError } = await supabase
                .from('files')
                .update({
                    name: fileEffettivo.name,
                    storage_path: nuovoPath,
                    size: fileEffettivo.size,
                    type: fileEffettivo.type
                })
                .eq('id', fileDaSostituire.id);

            if (dbError) throw dbError;

            await supabase.storage
                .from('documenti')
                .remove([fileDaSostituire.storage_path]);

            setFileDaSostituire(null);
            setFileSelezionato(null);
            seturlFile("");

            await recuperaFile();
            chiudiCard();

        } catch (error) {
            console.error("Errore sostituzione:", error);
            alert("Errore sostituzione: " + error.message);
        } finally {
            setCaricamento(false);
        }
    };

    const aggiornaFiltri = (nuoviFiltri) => {
        setFiltri(prev => ({ ...prev, ...nuoviFiltri }));
    };

    const handleToggleFiltri = () => {
        if (!mostraFiltri) {
            aggiornaFiltri({ tipoEntita: 'file' });
        }
        setMostraFiltri(!mostraFiltri);
    };

    const apriGestoreCartella = async (nomeCartella) => {
        setCartellaAperta(nomeCartella);
        setCartellaTarget(nomeCartella); 
        setFileSelezionato(null);         
        seturlFile("");                  
        setTipoCard('gestione_cartella');

        const { data, error } = await supabase
            .from('files')
            .select('*')
            .eq('folder_path', nomeCartella);

        if (!error) setFileDellaCartella(data);
    };

    const eliminaFileDaCartella = async (file) => {
        const { error } = await supabase.from('files').delete().eq('id', file.id);
        if (!error) {
            setFileDellaCartella(prev => prev.filter(f => f.id !== file.id));
            recuperaFile(nomeCercato);
        }
    };

    const filtraFileCartella = async () => {
        if (!cartellaAperta) return;

        try {
            let query = supabase
                .from('files')
                .select('*')
                .eq('folder_path', cartellaAperta);

            if (termineRicercaInterna) {
                query = query.ilike('name', `%${termineRicercaInterna}%`);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            setFileDellaCartella(data);
        } catch (error) {
            console.error("Errore ricerca interna:", error.message);
        }
    };

    const eliminaElemento = async (item) => {
        if (!window.confirm(`Sei sicuro di voler eliminare ${item.is_folder ? 'la cartella' : 'il file'} "${item.name}"?`)) {
            return;
        }

        try {
            setCaricamento(true);

            if (item.is_folder) {
                const { error } = await supabase
                    .from('files')
                    .delete()
                    .eq('folder_path', item.name);

                if (error) throw error;
            } else {
                if (item.storage_path) {
                    await supabase.storage.from('documenti').remove([item.storage_path]);
                }

                const { error } = await supabase
                    .from('files')
                    .delete()
                    .eq('id', item.id);

                if (error) throw error;
            }

            await recuperaFile(nomeCercato);
        } catch (error) {
            console.error("Errore eliminazione:", error);
            alert("Errore durante l'eliminazione: " + error.message);
        } finally {
            setCaricamento(false);
        }
    };

    return {
        isInizializzato,
        tipoCard,
        tipoRinomina,
        fileSelezionato,
        caricamento,
        listaFile,
        fileDaRinominare,
        fileDaSostituire,
        nomeCercato,
        urlFIle,
        filtri,
        cartellaAperta,
        fileDellaCartella,
        cartellaTarget,
        termineRicercaInterna,
        mostraFiltri,
        isCartella: filtri.tipoEntita === 'cartella',
        handleToggleFiltri,
        eliminaElemento,
        setTermineRicercaInterna,
        setTipoCard,
        setCartellaTarget,
        apriGestoreCartella,
        eliminaFileDaCartella,
        recuperaFile,
        aggiornaFiltri,
        resetFiltri,
        setFiltri,
        seturlFile,
        setNomeCercato,
        setMostraFiltri,
        apriUpload,
        apriRinominaFile,
        apriRinominaCartella,
        chiudiCard,
        selezionaFile,
        uploadSuSupabase,
        confermaRinomina,
        apriModificaFile,
        gestisciSalvataggio
    };
}