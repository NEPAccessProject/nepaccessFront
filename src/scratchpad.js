var response = {
	"data": [
		{
			"doc": {
				"id": 11051,
				"title": "Santa Cruz River Paseo de las Iglesias Feasbility Study To Identify Define and Solve Environmental Degradation Flooding and Water Resource Problems City of Tucson Pima County AZ",
				"documentType": "Final",
				"commentDate": "2005-12-05",
				"registerDate": "2005-11-18",
				"agency": "U.S. Army Corps of Engineers",
				"department": null,
				"cooperatingAgency": null,
				"state": "AZ",
				"county": "AZ: Pima",
				"filename": "EisDocument-UOFA-01767.zip",
				"commentsFilename": "",
				"folder": "EisDocument-UOFA-01767",
				"size": 105044316,
				"link": null,
				"notes": null,
				"status": null,
				"subtype": null,
				"summaryText": null,
				"noiDate": null,
				"draftNoa": null,
				"finalNoa": null,
				"firstRodDate": null,
				"processId": 1004028,
				"action": "Conservation/Restoration/ Bio. Resource use",
				"decision": "Project"
			},
			"filenames": [
				"050477/050477_0001.pdf",
				"050477/050477_0002.pdf",
				"050477/050477_0003.pdf",
				"050477/050477_0004.pdf",
				"050477/050477_0005.pdf",
				"050477/050477_0006.pdf"
			]
		},
		{
			"doc": {
				"id": 11052,
				"title": "Santa Cruz River Paseo de las Iglesias Feasibility Study To Identify Define and Solve Environmental Degradation Flooding and Water Resource Problems City of Tucson Pima County AZ",
				"documentType": "Draft",
				"commentDate": "2004-11-12",
				"registerDate": "2004-10-08",
				"agency": "U.S. Army Corps of Engineers",
				"department": null,
				"cooperatingAgency": null,
				"state": "AZ",
				"county": "AZ: Pima",
				"filename": "EisDocument-UOFA-02328.zip",
				"commentsFilename": "CommentLetters-83250.zip",
				"folder": "EisDocument-UOFA-02328",
				"size": 68769624,
				"link": null,
				"notes": null,
				"status": null,
				"subtype": null,
				"summaryText": null,
				"noiDate": null,
				"draftNoa": null,
				"finalNoa": null,
				"firstRodDate": null,
				"processId": 1004028,
				"action": "Conservation/Restoration/ Bio. Resource use;Water Works",
				"decision": "Project"
			},
			"filenames": [
				"040460/040460_0001-cprs.pdf",
				"040460/040460_0002-cprs.pdf",
				"040460/040460_0003-cprs.pdf",
				"040460/040460_0004-cprs.pdf",
				"040460/040460_0005-cprs.pdf",
				"040460/040460_0006-cprs.pdf",
				"040460/040460_0007-cprs.pdf",
				"040460/040460_0008-cprs.pdf",
				"040460/040460_0009-cprs.pdf",
				"040460/040460_0010-cprs.pdf",
				"040460/040460_0011-cprs.pdf",
				"040460/040460_0012-cprs.pdf",
				"040460/040460_0013-cprs.pdf",
				"040460/040460_0014-cprs.pdf",
				"040460/040460_0015-cprs.pdf",
				"040460/040460_0016-cprs.pdf",
				"040460/040460_0017-cprs.pdf",
				"040460/040460_0018-cprs.pdf",
				"040460/040460_0019-cprs.pdf",
				"040460/040460_0020-cprs.pdf",
				"040460/040460_0021-cprs.pdf",
				"040460/040460_0022-cprs.pdf",
				"040460/040460_0023-cprs.pdf",
				"040460/040460_0024-cprs.pdf"
			]
		}
]}

var data = response.data;
console.log('DATA KEYS',Object.keys(data));
var files = [];
var filenames = []

data.map((item,idx)=>{
  const doc = item.doc;
  const _filenames = item.filenames;

  filenames.push({
    id: doc.id,
    processId: doc.processId,
    folder: doc.folder,
    filenames: _filenames
  })

  files.push({
    id: doc.id,
    processId: doc.processId,
    folder: doc.folder,
    documentType: doc.documentType,
    size: doc.size,
    filenames: _filenames
  })
})

console.log(files)