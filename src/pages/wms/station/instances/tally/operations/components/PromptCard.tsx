import React from "react"

const TextMap = {
    WAIT_ROBOT: "Please wait,Gathering the Shelves for the next task.",
    NO_TASK: "HIT CONTAINER LEAVE WHEN READY."
}

const PromptCard = ({ stationProcessingStatus }: any) => {
    return (
        <div className="h-full text-4xl text-center d-flex items-center">
            {/* HIT CONTAINER LEAVE WHEN READY. */}
            {/* Please wait, Gathering the shelves for the next task. */}
            {TextMap[stationProcessingStatus]}
        </div>
    )
}

export default PromptCard
