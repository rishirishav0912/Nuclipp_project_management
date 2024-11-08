const mongoose = require("mongoose");
const { Project } = require("../models/projectModel");
const Employee = require("../models/employeeModel");
const crypto = require('crypto');
// const fetch = require('node-fetch');


//price a/c to package
const prices = {
    "silver": 100,
    "gold": 200,
    "diamond": 500,
    "platinum": 1000
}

//get all projects
const getprojects = (req, res) => {
    const id = req.params.employeeId;
    //getting employee by id in params
    Employee.findOne({ UserId: id }).then((foundEmp) => {

        if (!foundEmp) {
            return res.status(400).json({ error: "employee not found" })
        }

        //getting all projects with decreasing timestamp 
        let project = foundEmp["Projects"];
        if (project == undefined) {
            return res.status(200).json({ message: "no projects" });
        }
        else {
            return res.status(200).json(project);
        }
    }).catch((error) => {
        console.log(error);
        return res.status(400).json({ error: error.message });
    })

}

//adding a project
const addProject = async (req, res) => {
    const { link, duration, neeche, pkg } = req.body;
    const id = req.params.employeeId;
    const cost = (duration * prices[pkg]);

    let emptyFields = [];

    // if (!link) emptyFields.push('link');
    if (!duration) emptyFields.push('duration');
    if (!pkg) emptyFields.push('pkg');
    if (!neeche) emptyFields.push('neeche');

    if (emptyFields.length > 0) return res.status(400).json({ error: 'fill in all the details', emptyFields });

    //finding employee
    await Employee.findOne({ UserId: id }).then((foundEmp) => {

        if (!foundEmp) {
            return res.status(400).json({ error: "employee not found" })
        }

        const project = new Project({         // creating project
            Link: link,
            Duration: duration,
            Neeche: neeche,
            Package: pkg,
            Cost: cost
        })
        foundEmp["Projects"].unshift(project);
        foundEmp.save().then(() => {
            return res.status(200).json(foundEmp["Projects"][0]);
        }).catch((error) => {
            return res.status(400).json({ error: "enter correct details", emptyFields });
        });
    }).catch((error) => {
        return res.status(401).json({ error: error.message, emptyFields });
    })

}

//deleting project
const deleteProject = async (req, res) => {
    const id = req.params.employeeId;
    const projectId = req.params.projectId;
    await Employee.findOne({ UserId: id }).then((foundEmp) => {     //finding employee

        if (!foundEmp) {
            return res.status(400).json({ error: "employee not found" })
        }

        //finding and deleting project
        let projects = foundEmp["Projects"];
        if (projects == undefined) {
            return res.status(200).json({ message: "no projects" });
        }
        else {
            let deletedProject = projects.find((project) => project._id == projectId);
            foundEmp["Projects"] = projects.filter((project) => project._id != projectId);
            foundEmp.save();
            return res.status(200).json(deletedProject);
        }
    }).catch((error) => {
        return res.status(400).json({ error: "project cannot be deleted" });
    })
}

//updating project details
const updateProject = async (req, res) => {
    const id = req.params.employeeId;
    const projectId = req.params.projectId;
    const { link, duration, neeche, pkg } = req.body;
    const cost = (duration * prices[pkg]);

    let emptyFields = [];

    if (!link) emptyFields.push('link');
    if (!duration) emptyFields.push('duration');
    if (!pkg) emptyFields.push('pkg');
    if (!neeche) emptyFields.push('neeche');

    if (emptyFields.length > 0) return res.status(400).json({ error: 'fill in all the details', emptyFields });

    await Employee.findOne({ UserId: id }).then((foundEmp) => {     //finding employee
        //finding and updating project
        if (!foundEmp) {
            return res.status(400).json({ error: "employee not found" })
        }

        const project = new Project({         // creating project
            Link: link,
            Duration: duration,
            Neeche: neeche,
            Package: pkg,
            Cost: cost,
            Payment_Status: 'Unpaid'
        })
        let projects = foundEmp["Projects"]

        let p = projects.indexOf(projects.find((project) => project._id == projectId));
        foundEmp["Projects"][p] = project;

        foundEmp.save().then(() => {
            return res.status(200).json(foundEmp["Projects"]);
        }).catch((error) => {
            return res.status(400).json({ error: "enter correct project details", emptyFields });
        })
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ error: error.message, emptyFields });
    })
}

//paying project
const payProject = async (req, res) => {
    try {
        const { transactionId, MUID, name, amount, number } = req.body;
        const data = {
            "merchantId": process.env.MERCHANT_ID,
            "merchantTransactionId": transactionId,
            "merchantUserId": MUID,
            "name": name,
            "amount": Number(amount) * 100,
            "redirectUrl": `https://nuclipp-project-management-backend.vercel.app/user/auth/admin/status/${transactionId}`,
            "redirectMode": "POST",
            //"callbackUrl": "https://webhook.site/callback-url",
            "mobileNumber": number,
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }

        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString("base64");
        const keyIndex = 1;
        console.log(process.env.SALT_KEY)
        const payString = payloadMain + "/pg/v1/pay" + process.env.SALT_KEY;
        console.log(payString);
        const sha256 = crypto.createHash('sha256').update(payString).digest('hex');
        const checkSum = sha256 + "###" + keyIndex;

        console.log("checksum", checkSum);

        const prodUrl = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checkSum
            },
            body: JSON.stringify({ request: payloadMain })

        }

        await fetch(prodUrl, options).then(res => {
            console.log(res);
            console.log(res.json());
            res.redirect(res.data.instrumentResponse.redirectInfo.url);
        }).catch(err => console.error('error:', err));

    }
    catch {
        res.status(500).json({ error: "there is some error in payment" });
    }

}

//checking status of project payment
const checkStatus = (req, res) => {
    const merchantTransactionId = req.res.transactionId;
    const merchantId = req.res.merchantId;

    const keyIndex = 1
    const payString = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(payString).digest('hex')
    const checksum = sha256 + '###' + keyIndex

    const url = `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': merchantId
        },
    }

    fetch(url, options)
        .then(res => {
            if (res.data.success === true) res.status(200).json({ "msg": "payment succeeded" })
        })
        .catch(err => res.status(500).json({ error: "payment failed" }));
}


module.exports = {
    addProject,
    getprojects,
    deleteProject,
    updateProject,
    payProject,
    checkStatus
};