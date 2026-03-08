import { useState, useEffect } from "react"

type Player = {
  name: string
  rating: number
  present: boolean
}

export default function App() {

  const [players, setPlayers] = useState<Player[]>(() => {
  const savedPlayers = localStorage.getItem("players")
  return savedPlayers ? JSON.parse(savedPlayers) : []
})
  const [teams, setTeams] = useState<any[]>([])
  const [name, setName] = useState("")

useEffect(() => {

  localStorage.setItem("players", JSON.stringify(players))

}, [players])



  const addPlayer = () => {
    if (!name.trim()) return

if(players.some(p => p.name.toLowerCase() === name.toLowerCase())){
  alert("Este jogador já existe")
  return
}

    const newPlayer: Player = {
  name: name,
  rating: 3,
  present: true
}

    setPlayers([...players, newPlayer])
    setName("")
  }

  const removePlayer = (index:number) => {
    const newPlayers = players.filter((_,i)=> i !== index)
    setPlayers(newPlayers)
  }

  const changeRating = (index:number, rating:number) => {

    const updatedPlayers = [...players]
    updatedPlayers[index].rating = rating
    setPlayers(updatedPlayers)

  }
  
  const togglePresence = (index:number) => {

  const updatedPlayers = [...players]
  updatedPlayers[index].present = !updatedPlayers[index].present
  setPlayers(updatedPlayers)

}

  const generateTeams = () => {
  
    const availablePlayers = players.filter(p => p.present)

  if (availablePlayers.length < 4) {
    alert("São necessários pelo menos 4 jogadores")
    return
  }

const shuffled = [...availablePlayers].sort(()=>Math.random()-0.5)

const sortedPlayers = shuffled.sort((a,b)=>b.rating-a.rating)

const numberOfTeams = Math.ceil(availablePlayers.length / 5)

  const newTeams:any[] = Array.from({ length: numberOfTeams }, () => [])
  const teamRatings = new Array(numberOfTeams).fill(0)

  // definir quantos jogadores cada equipa deve ter
const teamSizes:number[] = []

let remainingPlayers = availablePlayers.length

for(let i=0;i<numberOfTeams;i++){

  if(i < 2){
    teamSizes.push(Math.min(5, remainingPlayers))
    remainingPlayers -= teamSizes[i]
  }else{
    teamSizes.push(remainingPlayers)
    remainingPlayers = 0
  }

}

// distribuir jogadores equilibrando rating
sortedPlayers.forEach(player => {

  let bestTeam = -1
  let lowestRating = Infinity

  for(let i=0;i<numberOfTeams;i++){

    if(newTeams[i].length >= teamSizes[i]) continue

    if(teamRatings[i] < lowestRating){
      lowestRating = teamRatings[i]
      bestTeam = i
    }

  }

  if(bestTeam !== -1){
    newTeams[bestTeam].push(player)
    teamRatings[bestTeam] += player.rating
  }

})

  setTeams(newTeams)

}

  return (

<div style={{
  maxWidth:"420px",
  margin:"40px auto",
  padding:"20px",
  fontFamily:"Arial",
  background:"rgb(255, 255, 255)",
  borderRadius:"20px",
  boxShadow:"0 10px 25px rgba(0, 0, 0, 0.25)"
}}>

      <h1 style={{
  textAlign:"center",
  marginBottom:"20px"
}}>
⚽ Sorteador de Equipas
</h1>

      <div style={{
  display:"flex",
  gap:"10px",
  marginBottom:"20px"
}}>

<input
  placeholder="Nome do jogador"
  value={name}
  onChange={(e)=>setName(e.target.value)}
  style={{
    flex:1,
    padding:"10px",
    borderRadius:"8px",
    border:"1px solid #ccc"
  }}
/>

<button
  onClick={addPlayer}
  style={{
    padding:"10px 16px",
    borderRadius:"8px",
    border:"none",
    background:"#4CAF50",
    color:"white",
    fontWeight:"bold"
  }}
>
+
</button>

</div>

<button
  onClick={generateTeams}
    style={{
    width:"100%",
    padding:"14px",
    borderRadius:"10px",
    border:"none",
    background:"#007BFF",
    color:"white",
    fontSize:"16px",
    fontWeight:"bold",
    marginBottom:"20px"
  }}
  
>
⚽ Sortear Equipas
</button>
<button
  onClick={generateTeams}
  style={{
    width:"100%",
    padding:"10px",
    borderRadius:"10px",
    border:"none",
    background:"#666",
    color:"white",
    fontSize:"14px",
    fontWeight:"bold",
    marginBottom:"20px"
  }}
>
🔄 Novo Sorteio
</button>

<h2>Equipas</h2>

{teams.map((team:any, index:number) => (

  <div key={index}>

    <h3>Equipa {index + 1}</h3>

    <ul>
      {team.map((player:any, i:number) => (
        <li key={i}>
          {player.name} ⭐ {player.rating}
        </li>
      ))}
    </ul>

  </div>

))}

<h2>Jogadores</h2>
<p style={{marginTop:"-10px", marginBottom:"10px", color:"#666"}}>
Jogadores presentes: {players.filter(p => p.present).length}
</p>

<div style={{
  display:"grid",
  gridTemplateColumns:"40px 1fr 120px 40px",
  alignItems:"center",
  fontWeight:"bold",
  padding:"10px",
  marginBottom:"6px"
}}>
  <div>⚽</div>
  <div>Nome</div>
  <div>Rating</div>
  <div></div>
</div>

<ul style={{listStyle:"none", padding:0, margin:0}}>
  {players.map((player, index) => {
    return (
      <li key={index}
  style={{
        display:"grid",    
        
        gridTemplateColumns:"40px 1fr 120px 40px",
  
        alignItems:"center",
  
        padding:"10px",
  
        marginBottom:"8px",
  
        borderRadius:"8px",
  
        background:"#f5f5f5"
  }}
>

        <input
          type="checkbox"
          style={{justifySelf:"center"}}
          checked={player.present}
          onChange={() => togglePresence(index)}
        />

        <div style={{paddingLeft:"4px"}}>
  {player.name}
</div>

<select
  style={{
    justifySelf:"center",
    fontSize:"10px",
    background:"white",
    borderRadius:"6px",
    padding:"4px"
  }}
  value={player.rating}
  onChange={(e) => changeRating(index, Number(e.target.value))}
>
  <option value={1}>⭐</option>
  <option value={2}>⭐⭐</option>
  <option value={3}>⭐⭐⭐</option>
  <option value={4}>⭐⭐⭐⭐</option>
  <option value={5}>⭐⭐⭐⭐⭐</option>
</select>

<button
  onClick={() => removePlayer(index)}
  style={{
    justifySelf:"center",
    border:"none",
    background:"transparent",
    color:"red",
    fontWeight:"bold",
    cursor:"pointer"
  }}
>
          X
        </button>

      </li>
    )
  })}
</ul>

    </div>

  )

}
