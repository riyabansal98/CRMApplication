const User = require("../models/user.model");
const Ticket = require("../models/ticket.model");
const constants = require("../utils/constants");
const objectConvertor = require("../utils/objectConverter");

/** 
 * Create a ticket: 
 * As soon as the ticket is created, it will be assigned to an Engineer if present
*/
exports.createTicket = async(req, res) => {

    const ticketObject = {
        title: req.body.title,
        ticketPriority: req.body.priority,
        status: req.body.status,
        reporter: req.userId,
        description: req.body.description
    }

    /**
     * Logic to find an engineer in the approved state
     */

    const engineer = await User.findOne({
        userType: constants.userTypes.engineer,
        userStatus: constants.userStatus.approved
    })

    ticketObject.assignee = engineer.userId;

    try {
        const ticket = await Ticket.create(ticketObject);

        if(ticket) {

            const user = await User.findOne({
                userId: req.userId
            });

            user.ticketsCreated.push(ticket._id);
            await user.save();

            engineer.ticketsAssigned.push(ticket._id);
            await engineer.save();

            res.status(201).send(objectConvertor.ticketResponse(ticket));
        }
    }catch(err) {
        console.log("Somr error happened while creating the ticket", err.message);
        res.status(500).send({
            message: "Some internal server error"
        })
    }
};

/**
 * 
 * Only the user who created the ticket should be allowed to update the ticket
 */
exports.updateTicket = async(req, res) => {

    const ticket = await Ticket.findOne({_id: req.params.id});

    if(ticket.reporter == req.userId) {

        ticket.title = req.body.title  != undefined ? req.body.title: ticket.title,
        ticket.description = req.body.description  != undefined ? req.body.description: ticket.description,
        ticket.priority = req.body.priority  != undefined ? req.body.priority: ticket.priority,
        ticket.status = req.body.status  != undefined ? req.body.status: ticket.status

        var updatedTicket = await ticket.save();

        res.status(200).send(objectConvertor.ticketResponse(updatedTicket));
    }else{
        console.log('Ticket was being updated by someone who has not created the ticket');
        res.status(400).send({
            message: "Ticket can be updated only by the customer who created it"
        })
    }
}

exports.getAllTickets = async(req, res) => {
    const queryObj = {
        reporter: req.userId
    }

    if(req.query.status != undefined) {
        queryObj.status = req.query.status;
    }

    const tickets = await Ticket.find(queryObj);

    res.status(200).send(objectConvertor.ticketListResponse(tickets));
}