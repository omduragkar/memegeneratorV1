import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import "./style.css"

const Header = () => {
    // For adding data so that we can use it while doing post request[Input data additon]:
    let [data, setData] = useState({});
    
    // For pushing the data of all the random memes we're generating:
    const [last, setLast] = useState({});

    // Giving random no. image out of 100 so that people don't get bored: 
    const [num, setNum] = useState(Math.floor(Math.random() * 10) + 1);
    // setting the final image after being uploaded: 
    const [changeff, setChangeeff] = useState("");

    
    // This useEffect hook will help me out to grab all the meme random image currenlty will get array of 100 images:
    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
        .then(response => response.json())
        .then(response => {
            const { memes } = response.data
            setLast({allMemeImgs:memes});
        });
    },[last]);

    // This genevent is the last stage for generating the meme: 
    const genevent = async(e)=>{
        e.preventDefault();
        console.log(last.allMemeImgs[num]);
        data = {...data, template_id:last.allMemeImgs[num].id, username:"YOUR_USERNAME_HERE", password:'YOUR_PASSWORD_HERE'}
        // console.log(data);
        fetch('https://api.imgflip.com/caption_image?' +new URLSearchParams({
            ...data
        }),{
            method:'POST'
        }).then(res=>{
            res.json().then(res=>{
                console.log(res.data);
                // Adding the last stage image url which we got after the changes:
                setChangeeff(res.data && res.data.url)
                setData({...data, text0:"", text1:""});
            })
        })
    }
  return <div>
      <form>
            <div className='my-3 mx-auto text-center'>
            <div>
                <label className='top'>Top: &nbsp;</label>
            </div>
          <input required type={'text'} placeholder={"Any Top Line"} value={data.text0 || ""} onChange={e=>setData({...data, [e.target.name]:e.target.value})} name='text0'/>
        </div>
        <div className='my-3 mx-auto text-center'>
            <div>
                <label className='top'>Bottom: &nbsp;</label>
            </div>
          <input required type={'text'} placeholder={"Any bottom Line"} value={data.text1 || ""} onChange={e=>setData({...data,[e.target.name]:e.target.value})} name='text1'/>
        </div>
        <div className='my-3 text-center'>
            <Button type="submit" className='btn btn-primary' onClick={e=>genevent(e)}>Generate</Button>
            {/* For skipping the image we can use this image option: */}
            <Button className='btn btn-warning mx-3' onClick={e=>{setNum(num + 1); setChangeeff("")}}>Skip</Button>
        </div>
      </form>
    
    <div>
        {changeff ?
        <div className='text-center'>
            <img className='imgtab' src={changeff} height={"500px"} width={'500px'} alt="final"/>
        </div>
        :
        <div className='text-center'>
            <div>
                <h2 className='top'>{data.top}</h2>
                {last.allMemeImgs && last.allMemeImgs.length>0 && <img className='imgtab' src={last.allMemeImgs[num].url} alt="random_img" height={"500px"} width={'500px'}/> }
                <h2 className='bottom'>{data.bottom}</h2>
            </div>
        </div>
        }
                
    </div>
  </div>; 
};

export default Header;
