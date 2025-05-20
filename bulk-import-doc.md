1- POST: /upload-csv 

@Params: 
FormData: {
    csvFile: File; 
    resource: ‘affair-resource’|’opportunity-resource’
}

@Returns 
{items: OriginalRecord[]; importId: string }


2- PUT: /match-records/:id 

@Params
resource: ‘affair-resource’|’opportunity-resource’
fieldsMatching: {
    key:string; 
    label:string; 
    matchedWidth:string; 
    options?:{{ key: string; label: string; matchedWith: string[] }}[];
    header: {en:string; fr:string}[];
    subHeader?: { en: string; fr: string };
}[]

@Returns MatchedRecord[]

3- PUT: /detect-duplications/:id 

@Params: 
resource: ‘affair-resource’|’opportunity-resource’
unicityFields: string[]

@Returns {
    originalRecords: OriginalRecord[];
    matchedRecord: MatchedRecord[];
    logs: // check logs interface 
    config: // check config interface 
}

4- PUT: /import-data
@Params: 
resource: ‘affair-resource’|’opportunity-resource’
importId: string

@Returns void



{
    "key": "contact.firstname",
    "label": "prénom",
    "matchedWith": "",
    "header": {
        "en": "common",
        "fr": "commun"
    },
    "subHeader": {
        "en": "main contact",
        "fr": "contact principal"
    }
}
