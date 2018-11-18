const render = require("../modules/render");

const express = require("express");
module.exports = function(env) {
    var router = express.Router();
    var docker = env.docker;
    var dba = env.dba;
    
    router.get("/dashboard", function(req, res) {
        render("pages/dashboard", req, res, { title : "Dashboard" });
    });
    
    router.get("/c9/:pid", function(req, res) {
        var uid = req.session.passport.user.id;
        var pid = req.params.pid;

        dba.getProjectByPid(pid).then(info => {
            if (!info) return render("pages/c9wrapper_err", req, res, { err : "not_exists" });

            var cid = info.containerId;
            var oid = info.owner;

            if (oid != uid) return render("pages/c9wrapper_err", req, res, { err : "not_yours" });

            if (!docker.isCidRunning(cid)) {
                render("pages/c9wrapper_err", req, res, { err : "not_running" });
            } else {
                render("pages/c9wrapper", req, res, { port : info.port, title : info.name });
            }
        })

    });

    router.get("/create_project", function(req, res) {
        render("pages/create_project", req, res, { title : "Create new project" });
    })

    return router;
}
