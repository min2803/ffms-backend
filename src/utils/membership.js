const HouseholdModel = require("../models/householdModel");

async function verifyMembership(householdId, userId) {
    const household = await HouseholdModel.findById(householdId);
    if (!household) {
        throw { status: 404, message: "Household not found" };
    }

    const member = await HouseholdModel.findMember(householdId, userId);
    if (!member) {
        throw { status: 403, message: "You are not a member of this household" };
    }
}

module.exports = { verifyMembership };
