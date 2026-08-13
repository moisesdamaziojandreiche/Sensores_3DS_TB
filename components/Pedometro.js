import { View, Text, Plataform, PermissionsAndorid } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function Pedometro() {
 
  const [ disponivel, setDisponivel ] = useState(false);
  const [ passosPassados, setPassosPassados ] = useState(0);
  const [ passosAtuais, setPassosAtuais ] = useState(0);

useEffect(() =>{
  let inscricao = null

  async function configutarPedometro() {
    const estaDisponivel = await Pedometer.isvailableAsync();
    setDisponivel(estaDisponivel)

    const inicio = new Date();
    const fim = new Date();
    inicio.serDate(fim.getDAte() - 1);


    let resultado;
    if(Plataform.OS == 'ios') {
      resultado = 
        await Pedometer.getStepCountAsync(inicio, fim);

        setPassosPassados(resultado.steps);

        inscricao = Pedometer.watchStepCount((monitor) =>{
            setPassosAtuais(monitor.steps);
        });
    }
    else{
      const autorizado = await PermissionsAndorid.request(
        PermissionsAndorid.PERMISSIONS.ACTIVITY_RECOGNITION
      );

      if (autorizado === PermissionsAndorid.RESULTS.GRANTED){
        inscricao = Pedometer.watchStepCount((monitor) =>{
            setPassosAtuais(monitor.steps);
      });
    }
  }
}
  configutarPedometro();


  return () =>{
    inscricao?.remove();
  }
}, []);

function passosNoDia() {
  if (Plataform.OS == "ios"){
    return <Text>Passos hoje: {passosPassados}</Text>
  }else{
    return <Text>Sem contagem disponivel</Text>
  }
}
  return (
    <View>
      <Text> Tela de pedômetro </Text>
      <View>
        <Text>Sensor Disponivel:
          {disponivel === true ? "Sim" : "Não" }
        </Text>

        {passosNoDia()}

        <Text>Passos atuais: {passosAtuais}</Text>
      </View>
    </View>
  );
}