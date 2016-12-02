angular.module('starter.services')

.service('EmailSvc', function($cordovaEmailComposer) {
    var self = this;    
    self.sendEmail = _sendEmail;    
    
    function _sendEmail(t, file) {
		return $cordovaEmailComposer.isAvailable().then(function() {
            var subj = t.title;
            subj += ": " + moment(t.startDate).format("M-D-YY");
            subj += (t.endDate)?" - " + moment(t.endDate).format("M-D-YY"):"";

            var b = 'Attached is a reimbursement report and associated receipt images.  Trip details are summarized in the pdf file.  All supporting receipt documentation is attached as a separate image file for each receipt.\n\n';
            b += "Purpose: " + t.purpose;
            
            var attachments = [ file ];
            attachments = attachments.concat(_receiptArray(t));
            
            var email = {
                to: 'expensereport@athletics.ucla.edu', 
				cc: 'akitagawa@athletics.ucla.edu',
				subject: subj,
				body: b, 
				attachments: attachments
			};

			return $cordovaEmailComposer.open(email).catch(function(error) {
				// user cancelled email
				console.log('user canceled the email send');
			});

		}).catch(function (error) {
		   // not available
			console.log('trouble with the email composer availability.');
		});
	}
    
    function _receiptArray(t) {
        var images = [];
        if (t && t.receipts) {
            t.receipts.forEach(function(r) {
                var dir = cordova.file.documentsDirectory;
                console.log(dir + r.image);
                images.push(dir + r.image);
            });
        }
        return images;
    }
});
